import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * Modo de búsqueda efectivo devuelto al cliente.
 */
export type SemanticSearchMode = 'SEMANTIC' | 'TEXTUAL' | 'TEXTUAL_FALLBACK';

export interface SemanticSearchOptions {
  /** Habilita búsqueda semántica. Default: true */
  semanticSearch?: boolean;
  /** Umbral de similitud coseno (0..1). Default: 0.7 */
  similarityThreshold?: number;
  /** Máximo de resultados. Default: 25 */
  limit?: number;
}

export interface SemanticSearchResult<T> {
  items: T[];
  totalCount: number;
  searchMode: SemanticSearchMode;
  similarityThreshold: number;
  scores?: number[];
}

/**
 * Servicio genérico para cómputo de embeddings y búsquedas por similitud.
 *
 * Implementación actual: stub determinista basado en hashing (no requiere red)
 * apto para e2e y desarrollo local. En producción sustituir `computeEmbedding`
 * por una integración real (OpenAI text-embedding-3-small, sentence-transformers,
 * etc.) y, cuando pgvector esté disponible en la DB, reemplazar `findSimilar`
 * por `ORDER BY embeddingCol <=> $1::vector`.
 */
@Injectable()
export class SemanticSearchService {
  private readonly logger = new Logger(SemanticSearchService.name);
  /** Dimensión fija (OpenAI text-embedding-3-small). */
  public static readonly DIMENSIONS = 1536;

  /**
   * Genera un embedding determinista a partir de texto. El vector resultante
   * tiene norma unitaria para simplificar la similitud coseno.
   */
  async computeEmbedding(text: string | null | undefined): Promise<number[]> {
    const normalized = (text || '').toLowerCase().trim();
    if (!normalized) return new Array(SemanticSearchService.DIMENSIONS).fill(0);
    const tokens = normalized.split(/[^a-z0-9áéíóúñü]+/i).filter(Boolean);
    const vector = new Array<number>(SemanticSearchService.DIMENSIONS).fill(0);
    for (const token of tokens) {
      const digest = crypto.createHash('sha256').update(token).digest();
      // Proyectamos el token en múltiples dimensiones del vector.
      for (let i = 0; i < digest.length; i += 2) {
        const idx = ((digest[i] << 8) | digest[i + 1]) % SemanticSearchService.DIMENSIONS;
        // signo: bit alto del byte siguiente define +/-
        const sign = digest[(i + 2) % digest.length] & 1 ? 1 : -1;
        vector[idx] += sign;
      }
    }
    // Normalizar a norma unitaria.
    let norm = 0;
    for (const v of vector) norm += v * v;
    norm = Math.sqrt(norm) || 1;
    for (let i = 0; i < vector.length; i++) vector[i] = vector[i] / norm;
    return vector;
  }

  /** Similitud coseno entre dos vectores de igual dimensión. */
  cosineSimilarity(a: number[], b: number[]): number {
    if (!a?.length || !b?.length || a.length !== b.length) return 0;
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    // Vectores ya normalizados -> dot == cos.
    return Math.max(-1, Math.min(1, dot));
  }

  /**
   * Busca por similitud semántica sobre una colección en memoria. Para grandes
   * volúmenes debe sustituirse por consulta pgvector nativa.
   */
  async findSimilar<T extends { semanticEmbedding?: number[] | null }>(
    items: T[],
    queryText: string,
    opts: SemanticSearchOptions = {},
  ): Promise<SemanticSearchResult<T>> {
    const semanticSearch = opts.semanticSearch !== false;
    const similarityThreshold = typeof opts.similarityThreshold === 'number' ? opts.similarityThreshold : 0.7;
    const limit = typeof opts.limit === 'number' && opts.limit > 0 ? opts.limit : 25;

    if (!queryText || !queryText.trim()) {
      return {
        items: items.slice(0, limit),
        totalCount: items.length,
        searchMode: semanticSearch ? 'SEMANTIC' : 'TEXTUAL',
        similarityThreshold,
        scores: [],
      };
    }

    if (!semanticSearch) {
      const textual = this.textualFilter(items, queryText).slice(0, limit);
      return {
        items: textual,
        totalCount: textual.length,
        searchMode: 'TEXTUAL',
        similarityThreshold,
      };
    }

    const queryEmbedding = await this.computeEmbedding(queryText);
    const scored: Array<{ item: T; score: number }> = [];
    for (const it of items) {
      const emb = it?.semanticEmbedding;
      if (!Array.isArray(emb) || !emb.length) continue;
      const score = this.cosineSimilarity(queryEmbedding, emb);
      if (score >= similarityThreshold) scored.push({ item: it, score });
    }
    if (scored.length === 0) {
      const textual = this.textualFilter(items, queryText).slice(0, limit);
      return {
        items: textual,
        totalCount: textual.length,
        searchMode: 'TEXTUAL_FALLBACK',
        similarityThreshold,
      };
    }
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, limit);
    return {
      items: top.map(s => s.item),
      totalCount: scored.length,
      searchMode: 'SEMANTIC',
      similarityThreshold,
      scores: top.map(s => s.score),
    };
  }

  private textualFilter<T>(items: T[], query: string): T[] {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(it => {
      try {
        const str = JSON.stringify(it).toLowerCase();
        return str.includes(q);
      } catch {
        return false;
      }
    });
  }
}
