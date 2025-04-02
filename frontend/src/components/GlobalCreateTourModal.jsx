import { useCreateTour } from '@context/CreateTourContext.jsx'
import CrearTourForm from './CrearTourForm.jsx'

const GlobalCreateTourModal = () => {
  const { isCreateTourModalOpen, closeCreateTourModal } = useCreateTour()

  return (
    <CrearTourForm
      isOpen={isCreateTourModalOpen}
      onClose={closeCreateTourModal}
      onSuccess={() => {
        // Aquí podrías agregar lógica adicional cuando el tour se crea exitosamente
        // Por ejemplo, mostrar una notificación
        closeCreateTourModal()
      }}
    />
  )
}

export default GlobalCreateTourModal
