import { useState, useMemo } from 'react';
import { useDrugs } from '../hooks/useDrugs';
import type { VeterinaryDrug } from '../types';

// ─── Props ────────────────────────────────────────────────────────────────────

interface DrugsDatabaseScreenProps {
  species: 'canine' | 'feline';
  category: 'anesthesia' | 'clinical' | 'emergency';
}

// Maps a UI category to the classification prefix(es) that belong to it.
// A drug matches if ANY of its classification strings starts with a matching prefix.
const CATEGORY_PREFIXES: Record<string, string[]> = {
  anesthesia: ['Anesthetic'],
  clinical:   ['Clinical Use'],
  emergency:  ['Emergency'],
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DrugsDatabaseScreen({ species, category }: DrugsDatabaseScreenProps) {
  const { data: drugs, isLoading, isError, error, refetch } = useDrugs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrugs = useMemo(() => {
    if (!drugs) return [];

    const prefixes = CATEGORY_PREFIXES[category];

    return drugs.filter((drug) => {
      // Must have species-specific dosing data
      const hasSpeciesData = Boolean(drug.dosage[species]);

      // Must belong to the selected category:
      // at least one of the drug's classifications must start with a category prefix.
      const matchesCategory = drug.classifications.some((cls) =>
        prefixes.some((prefix) => cls.startsWith(prefix))
      );

      // Must match the search query (empty query matches everything)
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch =
        lowerQuery === '' ||
        drug.drug_name.toLowerCase().includes(lowerQuery) ||
        drug.classifications.some((c) => c.toLowerCase().includes(lowerQuery)) ||
        drug.indications.some((i) => i.toLowerCase().includes(lowerQuery));

      return hasSpeciesData && matchesCategory && matchesSearch;
    });
  }, [drugs, species, category, searchQuery]);

  // ── Loading State ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={styles.stateContainer}>
        <div style={styles.spinner} />
        <p style={styles.stateText}>Loading drug formulary…</p>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div style={styles.stateContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Could not connect to the drug database</h3>
        <p style={styles.stateText}>
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
        <p style={styles.stateHint}>
          Make sure the API server is running:{' '}
          <code style={styles.code}>npm run api</code>
        </p>
        <button className="btn btn-primary" onClick={() => refetch()} style={{ marginTop: '20px' }}>
          Try Again
        </button>
      </div>
    );
  }

  // ── Data State ───────────────────────────────────────────────────────────
  return (
    <div style={styles.wrapper}>
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          id="drug-search-input"
          type="text"
          placeholder="Search by drug name, classification, or indication…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
          autoFocus
        />
        {searchQuery && (
          <button
            style={styles.clearButton}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results count */}
      <p style={styles.resultsCount}>
        {filteredDrugs.length === 0
          ? 'No drugs found'
          : `${filteredDrugs.length} drug${filteredDrugs.length !== 1 ? 's' : ''} found for ${species === 'canine' ? 'Canine 🐕' : 'Feline 🐈'}`}
      </p>

      {/* Drug Cards Grid */}
      {filteredDrugs.length > 0 ? (
        <div style={styles.grid}>
          {filteredDrugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} species={species} />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>💊</p>
          <p style={styles.stateText}>No drugs match your search.</p>
          <button
            className="btn btn-secondary"
            onClick={() => setSearchQuery('')}
            style={{ marginTop: '12px' }}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Drug Card Component ──────────────────────────────────────────────────────

interface DrugCardProps {
  drug: VeterinaryDrug;
  species: 'canine' | 'feline';
}

function DrugCard({ drug, species }: DrugCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dosage = drug.dosage[species]!;

  return (
    <div
      id={`drug-card-${drug.id}`}
      style={{
        ...styles.card,
        ...(isExpanded ? styles.cardExpanded : {}),
      }}
      onClick={() => setIsExpanded((prev) => !prev)}
    >
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div style={styles.cardTitleRow}>
          <h3 style={styles.drugName}>{drug.drug_name}</h3>
          <span style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</span>
        </div>

        {/* Classifications */}
        <div style={styles.badgeRow}>
          {drug.classifications.map((cls) => (
            <span key={cls} style={styles.badge}>
              {cls}
            </span>
          ))}
        </div>
      </div>

      {/* Dose Preview (always visible) */}
      <div style={styles.dosePreview}>
        <span style={styles.doseLabel}>Dose</span>
        <span style={styles.doseValue}>
          {dosage.min_mg_kg}–{dosage.max_mg_kg} {dosage.unit}
        </span>
      </div>

      {/* Expanded Detail Panel */}
      {isExpanded && (
        <div style={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
          <Divider />

          <DetailSection title="Description">
            <p style={styles.detailText}>{drug.description}</p>
          </DetailSection>

          {dosage.notes && (
            <DetailSection title="Dosing Notes">
              <p style={styles.detailText}>{dosage.notes}</p>
            </DetailSection>
          )}

          <DetailSection title="Indications">
            <TagList items={drug.indications} />
          </DetailSection>

          {drug.onset_of_action && (
            <DetailSection title="Onset of Action">
              <p style={styles.detailText}>{drug.onset_of_action}</p>
            </DetailSection>
          )}

          {drug.contraindications.length > 0 && (
            <DetailSection title="⚠️ Contraindications">
              <TagList items={drug.contraindications} variant="warning" />
            </DetailSection>
          )}

          {drug.side_effects.length > 0 && (
            <DetailSection title="Side Effects">
              <TagList items={drug.side_effects} />
            </DetailSection>
          )}

          {drug.drug_interactions.length > 0 && (
            <DetailSection title="Drug Interactions">
              <TagList items={drug.drug_interactions} variant="caution" />
            </DetailSection>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Small Utility Components ─────────────────────────────────────────────────

function Divider() {
  return <hr style={styles.divider} />;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.detailSection}>
      <p style={styles.detailSectionTitle}>{title}</p>
      {children}
    </div>
  );
}

function TagList({
  items,
  variant = 'default',
}: {
  items: string[];
  variant?: 'default' | 'warning' | 'caution';
}) {
  const variantStyle =
    variant === 'warning'
      ? styles.tagWarning
      : variant === 'caution'
        ? styles.tagCaution
        : styles.tagDefault;

  return (
    <ul style={styles.tagList}>
      {items.map((item) => (
        <li key={item} style={{ ...styles.tagItem, ...variantStyle }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  // State containers (loading / error / empty)
  stateContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorIcon: { fontSize: '2.5rem' },
  errorTitle: {
    fontSize: '1.2rem',
    fontFamily: "'Outfit', sans-serif",
    margin: '0',
  },
  stateText: {
    color: 'var(--text-muted)',
    textAlign: 'center',
    margin: '0',
    fontSize: '0.95rem',
  },
  stateHint: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    margin: '0',
  },
  code: {
    background: 'rgba(255,255,255,0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px',
  },
  emptyIcon: {
    fontSize: '3rem',
    margin: '0 0 8px 0',
  },

  // Layout
  wrapper: {
    width: '100%',
  },

  // Search
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    marginBottom: '16px',
    transition: 'border-color 0.2s ease',
  },
  searchIcon: {
    fontSize: '1.1rem',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontFamily: "'Inter', sans-serif",
  },
  clearButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '2px 6px',
    borderRadius: '4px',
    flexShrink: 0,
  },

  // Results count
  resultsCount: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    marginBottom: '20px',
  },

  // Drug grid
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  // Drug card
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardExpanded: {
    border: '1px solid var(--primary)',
    background: 'rgba(99, 102, 241, 0.04)',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  cardTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drugName: {
    margin: 0,
    fontSize: '1.05rem',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
  },
  expandIcon: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    flexShrink: 0,
  },
  badgeRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  badge: {
    fontSize: '0.7rem',
    padding: '3px 8px',
    borderRadius: '20px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--primary)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },

  // Dose preview
  dosePreview: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  doseLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  doseValue: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--secondary)',
    fontFamily: 'monospace',
  },

  // Expanded content
  expandedContent: {
    marginTop: '4px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border-color)',
    margin: '16px 0',
  },
  detailSection: {
    marginBottom: '16px',
  },
  detailSectionTitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    margin: '0 0 8px 0',
  },
  detailText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    margin: 0,
  },
  tagList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  tagItem: {
    fontSize: '0.85rem',
    padding: '4px 10px',
    borderRadius: '6px',
    lineHeight: '1.4',
  },
  tagDefault: {
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  tagWarning: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  tagCaution: {
    background: 'rgba(251, 191, 36, 0.1)',
    color: '#fcd34d',
    border: '1px solid rgba(251, 191, 36, 0.2)',
  },
};
