
import type { Habit,Task } from '../../items/types/items.types';
import type { Nothe } from '../../nothes/types/nothes.types';

import { Button } from '../../components/components/Button'

interface FormActionsProps {
  selectedElement: Habit|Task|Nothe|null;          // si es null => Add, si tiene valor => Edit
  isSubmitting?: boolean;         // opcional, si true muestra Adding/Editing
  onCancel: () => void;           // función para cancelar
  className?: string;            // clases adicionales para el contenedor
  cancelClassName?: string;      // clases adicionales para botón Cancelar
  submitClassName?: string;      // clases adicionales para botón Submit
}

export default function FormActions({
  selectedElement,
  isSubmitting = false,
  onCancel,
  className = '',
  cancelClassName = '',
  submitClassName = '',
}: FormActionsProps) {

  let submitText = 'Add';
  if (selectedElement !== null && selectedElement !== undefined) {
    submitText = isSubmitting ? 'Editing' : 'Edit';
  } else {
    submitText = isSubmitting ? 'Adding' : 'Add';
  }

  return (
    <div className={`flex mt-2 justify-between px-5 ${className}`}>
      <Button
        disabled={ isSubmitting|| false}
        type="button"
        variant="secondary"
        className={`h-min px-9 py-2 rounded-[40px] text-xl max-[700px]:text-lg mb-7 bg-primary/2 ${cancelClassName}`}
        onClick={onCancel}
      >
        Cancel
      </Button>
      
      <Button
        disabled={ isSubmitting ||false}
        type="submit"
        className={`h-min text-xl max-[700px]:text-lg py-2 px-9 rounded-[40px] ${submitClassName}`}
    >

        {submitText}
      </Button>
    </div>
  );
}