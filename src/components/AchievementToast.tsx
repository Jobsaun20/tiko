
import { AchievementModal } from "./AchievementModal";
import { Achievement } from "@/utils/gamification";

interface AchievementToastProps {
  achievements: Achievement[];
  onComplete: () => void;
}

export const AchievementToast = ({ achievements, onComplete }: AchievementToastProps) => {
  return (
    <AchievementModal 
      achievements={achievements}
      onComplete={onComplete}
    />
  );
};
