export default function Stars({ rating, numReviews }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return '★';
    if (i < rating) return '½';
    return '☆';
  });
  return (
    <div className="stars" style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.85rem' }}>
      <span style={{ color: '#f90' }}>{stars.join('')}</span>
      {numReviews !== undefined && (
        <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>({numReviews})</span>
      )}
    </div>
  );
}
