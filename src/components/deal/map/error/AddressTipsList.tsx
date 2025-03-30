
interface AddressTipsListProps {
  className?: string;
}

export const AddressTipsList = ({ className }: AddressTipsListProps) => {
  return (
    <div className={`text-sm text-muted-foreground mt-2 ${className || ''}`}>
      <p className="font-medium">Tips:</p>
      <ul className="list-disc list-inside space-y-1 mt-1">
        <li>Kontrollera att adressen är korrekt och fullständig</li>
        <li>Inkludera gatunummer, postnummer och stad</li>
        <li>Exempel på bra format: "Torsplan 8, 113 65 Stockholm"</li>
      </ul>
    </div>
  );
};
