import React, { useState, useEffect } from 'react';
import { useCards } from '../../hooks/useCards';
import { useGameStore } from '../../store/gameStore';
import { FaSave } from 'react-icons/fa';
import styles from './BulkEditCards.module.css';
import { Card } from '../../types/card';

interface BulkEditCardsProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface FilterCriteria {
  starLevel: number;
  category: string;
  class: string;
}

interface BulkUpdateData {
  stats?: {
    attack?: number;
    defense?: number;
    health?: number;
    energy?: number;
  };
  moves?: string[];
  skills?: string[];
}

export default function BulkEditCards({ onClose, onSuccess }: BulkEditCardsProps) {
  const { cards, updateCard } = useCards();
  const { categories } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [affectedCount, setAffectedCount] = useState<number>(0);

  // Filter criteria
  const [filters, setFilters] = useState<FilterCriteria>({
    starLevel: 1,
    category: '',
    class: '',
  });

  // Update data
  const [updateData, setUpdateData] = useState<BulkUpdateData>({
    stats: {
      attack: undefined,
      defense: undefined,
      health: undefined,
      energy: undefined,
    },
    moves: [],
    skills: [],
  });

  // Available options
  const [classes, setClasses] = useState<string[]>([]);

  useEffect(() => {
    loadClasses();
    calculateAffectedCards();
  }, [filters, cards]);

  const loadClasses = () => {
    // Extract unique classes from existing cards
    const uniqueClasses = [...new Set(cards.map(card => card.class))];
    setClasses(uniqueClasses.filter(Boolean));
  };

  const calculateAffectedCards = () => {
    const filteredCards = cards.filter(card => {
      if (filters.starLevel && card.starLevel !== filters.starLevel) return false;
      if (filters.category && card.category !== filters.category) return false;
      if (filters.class && card.class !== filters.class) return false;
      return true;
    });

    setAffectedCount(filteredCards.length);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Build the update object, only including defined values
      const updates: Partial<Card> = {};
      
      if (updateData.stats) {
        const stats: any = { ...updateData.stats };
        Object.keys(stats).forEach(key => {
          if (stats[key] === undefined) delete stats[key];
        });
        if (Object.keys(stats).length > 0) {
          updates.stats = stats;
        }
      }

      if (updateData.moves?.length > 0) {
        updates.moves = updateData.moves;
      }

      if (updateData.skills?.length > 0) {
        updates.skills = updateData.skills;
      }

      // Only proceed if there are actual updates
      if (Object.keys(updates).length > 0) {
        const cardsToUpdate = cards.filter(card => {
          if (filters.starLevel && card.starLevel !== filters.starLevel) return false;
          if (filters.category && card.category !== filters.category) return false;
          if (filters.class && card.class !== filters.class) return false;
          return true;
        });

        // Update each card that matches the criteria
        await Promise.all(cardsToUpdate.map(card => 
          updateCard({ ...card, ...updates })
        ));

        onSuccess();
      }
    } catch (error) {
      console.error('Error updating cards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bulk Edit Cards</h2>
      
      <div className={styles.section}>
        <h3>Filter Cards</h3>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label>Star Level:</label>
            <select
              value={filters.starLevel}
              onChange={(e) => setFilters({ ...filters, starLevel: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>{level} Star</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">Any Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Class:</label>
            <select
              value={filters.class}
              onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            >
              <option value="">Any Class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.affectedCount}>
          Cards affected: <span>{affectedCount}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Update Stats</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statInput}>
            <label>Attack:</label>
            <input
              type="number"
              value={updateData.stats?.attack || ''}
              onChange={(e) => setUpdateData({
                ...updateData,
                stats: { ...updateData.stats, attack: e.target.value ? Number(e.target.value) : undefined }
              })}
              placeholder="No change"
            />
          </div>
          <div className={styles.statInput}>
            <label>Defense:</label>
            <input
              type="number"
              value={updateData.stats?.defense || ''}
              onChange={(e) => setUpdateData({
                ...updateData,
                stats: { ...updateData.stats, defense: e.target.value ? Number(e.target.value) : undefined }
              })}
              placeholder="No change"
            />
          </div>
          <div className={styles.statInput}>
            <label>Health:</label>
            <input
              type="number"
              value={updateData.stats?.health || ''}
              onChange={(e) => setUpdateData({
                ...updateData,
                stats: { ...updateData.stats, health: e.target.value ? Number(e.target.value) : undefined }
              })}
              placeholder="No change"
            />
          </div>
          <div className={styles.statInput}>
            <label>Energy:</label>
            <input
              type="number"
              value={updateData.stats?.energy || ''}
              onChange={(e) => setUpdateData({
                ...updateData,
                stats: { ...updateData.stats, energy: e.target.value ? Number(e.target.value) : undefined }
              })}
              placeholder="No change"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Update Moves & Skills</h3>
        <div className={styles.movesSkills}>
          <div className={styles.inputGroup}>
            <label>Moves (comma-separated):</label>
            <input
              type="text"
              value={updateData.moves?.join(', ') || ''}
              onChange={(e) => setUpdateData({
                ...updateData,
                moves: e.target.value.split(',').map(move => move.trim()).filter(Boolean)
              })}
              placeholder="Enter moves, separated by commas"
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Skills (comma-separated):</label>
            <input
              type="text"
              value={updateData.skills?.join(', ') || ''}
              onChange={(e) => setUpdateData({
                ...updateData,
                skills: e.target.value.split(',').map(skill => skill.trim()).filter(Boolean)
              })}
              placeholder="Enter skills, separated by commas"
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.cancelButton}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={loading || affectedCount === 0}
        >
          {loading ? 'Saving...' : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
