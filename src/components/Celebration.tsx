interface ConfettiParticleProps {
  color: string;
  left: number;
  delay: number;
}

function ConfettiParticle({ color, left, delay }: ConfettiParticleProps) {
  return (
    <div
      className="absolute top-0 w-3 h-3 rounded-full animate-fall opacity-0"
      style={{
        backgroundColor: color,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${2 + Math.random()}s`,
      }}
    />
  );
}

interface CelebrationProps {
  active: boolean;
}

const COLORS = ["#FF69B4", "#FFD700", "#00BFFF", "#FF4500", "#32CD32"];

export function Celebration({ active }: CelebrationProps) {
  if (!active) return null;

  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <ConfettiParticle
          key={p.id}
          color={p.color}
          left={p.left}
          delay={p.delay}
        />
      ))}
    </div>
  );
}
