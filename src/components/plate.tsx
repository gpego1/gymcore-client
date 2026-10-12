'use client';

export default function Plate() {
  return <div className="plate-scene" aria-hidden="true">
    <div className="plate-shadow" />
    <div className="weight-plate">
      <div className="plate-back" />
      <div className="plate-side" />
      <div className="plate-front">
        <span className="plate-word top">GYMCORE</span>
        <span className="plate-weight">20<small>KG</small>
        </span>
        <div className="plate-hole" />
        <span className="plate-word bottom">BUILT TO GO BEYOND</span>
        <span className="plate-grip grip-left" />
        <span className="plate-grip grip-right" />
      </div>
    </div>
    <span className="plate-caption">FORÇA · EQUILÍBRIO · EVOLUÇÃO</span>
  </div>;
}
