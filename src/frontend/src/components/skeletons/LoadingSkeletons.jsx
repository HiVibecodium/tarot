/**
 * Reusable Loading Skeleton Components
 * Beautiful loading states instead of generic "Loading..."
 */

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './LoadingSkeletons.css';

/**
 * Card Skeleton
 * For tarot card loading
 */
export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton height={400} borderRadius={12} />
      <Skeleton count={2} style={{ marginTop: 10 }} />
    </div>
  );
}

/**
 * Three Cards Skeleton
 * For decision reading (Past/Present/Future)
 */
export function ThreeCardsSkeleton() {
  return (
    <div className="three-cards-skeleton">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

/**
 * Reading History Item Skeleton
 */
export function HistoryItemSkeleton() {
  return (
    <div className="history-item-skeleton">
      <Skeleton circle width={50} height={50} />
      <div className="history-content">
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} style={{ marginTop: 8 }} />
      </div>
    </div>
  );
}

/**
 * Reading History List Skeleton
 */
export function HistoryListSkeleton({ count = 5 }) {
  return (
    <div className="history-list-skeleton">
      {Array(count).fill(0).map((_, i) => (
        <HistoryItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Analytics Chart Skeleton
 */
export function ChartSkeleton({ height = 300 }) {
  return (
    <div className="chart-skeleton">
      <Skeleton height={height} borderRadius={8} />
      <div className="chart-legend">
        <Skeleton width={100} height={12} />
        <Skeleton width={100} height={12} />
        <Skeleton width={100} height={12} />
      </div>
    </div>
  );
}

/**
 * Analytics Page Full Skeleton
 */
export function AnalyticsSkeleton() {
  return (
    <div className="analytics-skeleton">
      <div className="skeleton-header">
        <Skeleton width={200} height={32} />
      </div>

      <div className="skeleton-section">
        <Skeleton width={180} height={24} style={{ marginBottom: 15 }} />
        <ChartSkeleton height={300} />
      </div>

      <div className="skeleton-section">
        <Skeleton width={180} height={24} style={{ marginBottom: 15 }} />
        <ChartSkeleton height={250} />
      </div>

      <div className="skeleton-section">
        <Skeleton width={180} height={24} style={{ marginBottom: 15 }} />
        <div className="stats-grid">
          <Skeleton height={100} borderRadius={8} />
          <Skeleton height={100} borderRadius={8} />
          <Skeleton height={100} borderRadius={8} />
        </div>
      </div>
    </div>
  );
}

/**
 * Profile Stats Skeleton
 */
export function ProfileStatsSkeleton() {
  return (
    <div className="profile-stats-skeleton">
      <div className="stats-row">
        <Skeleton width={120} height={80} borderRadius={8} />
        <Skeleton width={120} height={80} borderRadius={8} />
        <Skeleton width={120} height={80} borderRadius={8} />
      </div>
      <Skeleton count={3} height={20} style={{ marginTop: 20 }} />
    </div>
  );
}

/**
 * Card Grid Skeleton
 * For cards encyclopedia page
 */
export function CardGridSkeleton({ count = 12 }) {
  return (
    <div className="card-grid-skeleton">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="card-grid-item">
          <Skeleton height={300} borderRadius={12} />
          <Skeleton width="80%" style={{ marginTop: 10 }} />
        </div>
      ))}
    </div>
  );
}

/**
 * Dashboard Skeleton
 */
export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="welcome-section">
        <Skeleton width={250} height={32} />
        <Skeleton width={180} height={20} style={{ marginTop: 10 }} />
      </div>

      <div className="actions-section">
        <Skeleton height={120} borderRadius={12} />
        <Skeleton height={120} borderRadius={12} />
        <Skeleton height={120} borderRadius={12} />
      </div>

      <div className="streak-section">
        <Skeleton width={150} height={24} />
        <Skeleton width="100%" height={60} style={{ marginTop: 10 }} borderRadius={8} />
      </div>
    </div>
  );
}

/**
 * Generic Content Skeleton
 */
export function ContentSkeleton({ lines = 5 }) {
  return (
    <div className="content-skeleton">
      <Skeleton count={lines} height={16} style={{ marginBottom: 8 }} />
    </div>
  );
}

/**
 * Table Skeleton
 */
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="table-skeleton">
      {Array(rows).fill(0).map((_, i) => (
        <div key={i} className="table-row-skeleton">
          {Array(cols).fill(0).map((_, j) => (
            <Skeleton key={j} height={40} style={{ margin: 5 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
