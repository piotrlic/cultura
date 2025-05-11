import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  hasCard: boolean
  onEdit?: () => void
  onDelete?: () => void
  onCreate?: () => void
}

const ActionButtons = ({ hasCard, onEdit, onDelete, onCreate }: ActionButtonsProps) => {
  if (hasCard) {
    return (
      <div className="flex gap-4 flex-wrap">
        <Button variant="default" onClick={onEdit} aria-label="Edytuj wizytówkę">
          Edytuj wizytówkę
        </Button>
        <Button variant="destructive" onClick={onDelete} aria-label="Usuń wizytówkę">
          Usuń wizytówkę
        </Button>
        <Button
          variant="outline"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          aria-label="Kopiuj link do tej strony"
        >
          Kopiuj link do tej strony
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <Button variant="default" onClick={onCreate} aria-label="Utwórz wizytówkę">
        Utwórz wizytówkę
      </Button>
    </div>
  )
}

export default ActionButtons
