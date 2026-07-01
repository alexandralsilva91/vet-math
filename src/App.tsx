import { useState } from 'react';
import DrugsDatabaseScreen from './screens/DrugsDatabaseScreen';

type Screen = 'species' | 'category' | 'section' | 'drugs-database';
type Species = 'canine' | 'feline';
type Category = 'anesthesia' | 'clinical' | 'emergency';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('species');
  const [species, setSpecies] = useState<Species | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const handleSpeciesSelect = (selected: Species) => {
    setSpecies(selected);
    setCurrentScreen('category');
  };

  const handleCategorySelect = (selected: Category) => {
    setCategory(selected);
    setCurrentScreen('section');
  };

  const handleBack = () => {
    if (currentScreen === 'drugs-database') {
      setCurrentScreen('section');
    } else if (currentScreen === 'section') {
      setCurrentScreen('category');
    } else if (currentScreen === 'category') {
      setCurrentScreen('species');
      setSpecies(null);
    }
  };

  return (
    <div style={styles.container}>
      {/* Premium Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
            <path d="M4 14a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2z" />
            <path d="M20 14a2 2 0 0 1-2-2 2 2 0 0 1 2-2 2 2 0 0 1 2 2 2 2 0 0 1-2 2z" />
          </svg>
          <span style={styles.logoText}>Vet Math</span>
        </div>
        <div style={styles.versionBadge}>MVP v0.1</div>
      </header>

      {/* Main Flow Container */}
      <main style={currentScreen === 'drugs-database' ? styles.mainFull : styles.main}>
        <div
          className="glass-card animate-fade-in"
          style={currentScreen === 'drugs-database' ? styles.cardWide : styles.card}
        >
          {/* Back Button — shown on every screen except species selection */}
          {currentScreen !== 'species' && (
            <button className="btn btn-secondary" onClick={handleBack} style={styles.backBtn}>
              &larr; Back
            </button>
          )}

          {/* ── Screen: Species ─────────────────────────────────────────── */}
          {currentScreen === 'species' && (
            <div>
              <div style={styles.headingGroup}>
                <h1 style={styles.title}>Select Patient Species</h1>
                <p style={styles.subtitle}>
                  Choose the species to begin calculating clinical drug doses
                </p>
              </div>

              <div style={styles.grid}>
                {/* Canine */}
                <div style={styles.gridItem} onClick={() => handleSpeciesSelect('canine')}>
                  <div style={styles.iconWrapper}>🐕</div>
                  <h3 style={styles.gridTitle}>Canine</h3>
                  <p style={styles.gridDesc}>Dogs and puppies specific formulary calculations.</p>
                </div>

                {/* Feline */}
                <div style={styles.gridItem} onClick={() => handleSpeciesSelect('feline')}>
                  <div style={styles.iconWrapper}>🐈</div>
                  <h3 style={styles.gridTitle}>Feline</h3>
                  <p style={styles.gridDesc}>Cats and kittens specific formulary calculations.</p>
                </div>

                {/* Exotic — Coming Soon */}
                <div style={{ ...styles.gridItem, ...styles.gridItemDisabled }}>
                  <span style={styles.comingSoonBadge}>Coming Soon</span>
                  <div style={styles.iconWrapper}>🦎</div>
                  <h3 style={styles.gridTitle}>Exotic Pets</h3>
                  <p style={styles.gridDesc}>Birds, reptiles, amphibians, and small mammals.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Screen: Category ────────────────────────────────────────── */}
          {currentScreen === 'category' && (
            <div>
              <div style={styles.headingGroup}>
                <h2 style={styles.title}>
                  Select Category &mdash;{' '}
                  <span style={styles.highlight}>
                    {species === 'canine' ? 'Canine 🐕' : 'Feline 🐈'}
                  </span>
                </h2>
                <p style={styles.subtitle}>Choose the application area for drug dosing</p>
              </div>

              <div style={styles.grid}>
                <div style={styles.gridItem} onClick={() => handleCategorySelect('anesthesia')}>
                  <div style={styles.iconWrapper}>💉</div>
                  <h3 style={styles.gridTitle}>Anesthesia</h3>
                  <p style={styles.gridDesc}>
                    Sedation, induction, CRIs, and pain management protocols.
                  </p>
                </div>

                <div style={styles.gridItem} onClick={() => handleCategorySelect('clinical')}>
                  <div style={styles.iconWrapper}>💊</div>
                  <h3 style={styles.gridTitle}>Clinical</h3>
                  <p style={styles.gridDesc}>
                    Antibiotics, analgesics, fluids, and standard treatments.
                  </p>
                </div>

                <div style={styles.gridItem} onClick={() => handleCategorySelect('emergency')}>
                  <div style={styles.iconWrapper}>🚨</div>
                  <h3 style={styles.gridTitle}>Emergency</h3>
                  <p style={styles.gridDesc}>
                    Reversal agents, antagonists, and critical care drugs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Screen: Section ─────────────────────────────────────────── */}
          {currentScreen === 'section' && (
            <div>
              <div style={styles.headingGroup}>
                <h2 style={styles.title}>
                  Select Section &mdash;{' '}
                  <span style={styles.highlight}>
                    {category === 'anesthesia'
                      ? 'Anesthesia 💉'
                      : category === 'emergency'
                        ? 'Emergency 🚨'
                        : 'Clinical 💊'}
                  </span>
                </h2>
                <p style={styles.subtitle}>
                  Manage your protocols or access the full drug inventory
                </p>
              </div>

              <div style={styles.grid}>
                {/* My Protocols — placeholder */}
                <div style={{ ...styles.gridItem, borderColor: 'var(--secondary)', opacity: 0.6, cursor: 'not-allowed' }}>
                  <span style={styles.comingSoonBadge}>Coming Soon</span>
                  <div style={styles.iconWrapper}>📁</div>
                  <h3 style={styles.gridTitle}>My Protocols</h3>
                  <p style={styles.gridDesc}>
                    Build, duplicate, and execute customized multi-drug calculation sheets.
                  </p>
                </div>

                {/* Drugs Database — live */}
                <div
                  id="nav-drugs-database"
                  style={{ ...styles.gridItem, borderColor: 'var(--primary)' }}
                  onClick={() => setCurrentScreen('drugs-database')}
                >
                  <div style={styles.iconWrapper}>🔍</div>
                  <h3 style={styles.gridTitle}>Drugs Database</h3>
                  <p style={styles.gridDesc}>
                    Search and filter species-specific formulary guidelines.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Screen: Drugs Database ───────────────────────────────────── */}
          {currentScreen === 'drugs-database' && species && (
            <div>
              <div style={{ ...styles.headingGroup, marginTop: '48px' }}>
                <h2 style={styles.title}>
                  Drugs Database &mdash;{' '}
                  <span style={styles.highlight}>
                    {species === 'canine' ? 'Canine 🐕' : 'Feline 🐈'}
                  </span>
                </h2>
                <p style={styles.subtitle}>
                  {category === 'anesthesia'
                    ? 'Anesthesia · '
                    : category === 'emergency'
                      ? 'Emergency · '
                      : 'Clinical · '}
                  Full species-specific formulary with dosing guidelines
                </p>
              </div>

              <DrugsDatabaseScreen species={species} category={category!} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(11, 15, 25, 0.6)',
    backdropFilter: 'blur(10px)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  versionBadge: {
    fontSize: '0.8rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    padding: '4px 10px',
    borderRadius: '20px',
    color: 'var(--text-muted)',
  },
  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
  },
  mainFull: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 20px',
  },
  card: {
    width: '100%',
    maxWidth: '960px',
    position: 'relative' as const,
  },
  cardWide: {
    width: '100%',
    maxWidth: '900px',
    position: 'relative' as const,
  },
  backBtn: {
    position: 'absolute' as const,
    top: '24px',
    left: '24px',
    padding: '6px 12px',
    fontSize: '0.85rem',
  },
  headingGroup: {
    textAlign: 'center' as const,
    marginBottom: '40px',
    marginTop: '20px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '1.05rem',
  },
  highlight: {
    color: 'var(--primary)',
    textTransform: 'capitalize' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    marginTop: '20px',
  },
  gridItem: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: '30px 20px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  gridItemDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  iconWrapper: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  gridTitle: {
    fontSize: '1.25rem',
    marginBottom: '8px',
    fontFamily: "'Outfit', sans-serif",
  },
  gridDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
  },
  comingSoonBadge: {
    position: 'absolute' as const,
    top: '12px',
    right: '-32px',
    background: 'var(--accent)',
    color: 'var(--text-inverse)',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '4px 35px',
    transform: 'rotate(45deg)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
};
