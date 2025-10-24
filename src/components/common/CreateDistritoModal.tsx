import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"

import { Distrito } from "~/domain/entities/Distrito"

import { ButtonComponent } from "../ui/button"
import { Input } from "../ui/input"
import { BaseModal } from "../ui/modal"

interface CreateDistritoModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  addDistrito: (distrito: Distrito) => void
}

interface FormData {
  name: string
}

export const CreateDistritoModal: React.FC<CreateDistritoModalProps> = ({ 
  isOpen,
  setIsOpen,
  addDistrito,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
      })
    }
  }, [isOpen])

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const distrito = new Distrito(crypto.randomUUID(), formData.name)
      addDistrito(distrito)
      setIsOpen(false)
      toast.success('Distrito adicionado com sucesso')
    } catch (error) {
      console.error('Error creating distrito:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text">Criar Novo Distrito</h2>
        <p className="text-sm text-text-secondary mt-1">
          Preencha as informações para criar um novo distrito
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
            Nome do Distrito *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Digite o nome do distrito"
            hasError={!!errors.name}
            className="w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <ButtonComponent
            type="button"
            variant="secondary"
            onClick={handleCancel}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancelar
          </ButtonComponent>
          <ButtonComponent
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
            disabled={!formData.name.trim()}
            loadingText="Criando..."
          >
            Criar Distrito
          </ButtonComponent>
        </div>
      </form>
    </div>
    </BaseModal>
  )
}