import * as React from "react"
import { useState } from "react"
import { Link } from "react-router"
import { toast } from "sonner"

import type { Daimoku } from "~/domain/entities/Daimoku"
import type { Distrito } from "~/domain/entities/Distrito"
import useHttpRequest from "~/hooks/common/useHttpRequest"

import { ButtonComponent } from "../ui/button"
import { Input } from "../ui/input"
import { BaseModal } from "../ui/modal"
import { Select, SelectContent, SelectItem,SelectTrigger, SelectValue } from "../ui/select"
import { CreateDistritoModal } from "./CreateDistritoModal"

interface RegisterDaimokuModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

interface FormData {
  memberCode: string
  memberName: string
  distritoId: string
  date: string
  minutes: number
}

export const RegisterDaimokuModal: React.FC<RegisterDaimokuModalProps> = ({ 
  isOpen,
  setIsOpen,
}) => {
  const MAX_MINUTES = 240;
  const [isCreateDistritoModalOpen, setIsCreateDistritoModalOpen] = useState(false)
  const [distritos, setDistritos] = useState<Distrito[]>([])
  const [formData, setFormData] = useState<FormData>({
    memberCode: '',
    memberName: '',
    distritoId: '',
    date: new Date().toISOString().split('T')[0],
    minutes: 20,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const httpClient = useHttpRequest()

  React.useEffect(() => {
    const fetchDistritos = async () => {
      const response = await httpClient.get<Distrito[]>('/distritos')
      if (response) {
        setDistritos(response)
      }
    }
    if (isOpen) {
      fetchDistritos()
      setFormData({
        memberCode: '',
        memberName: '',
        distritoId: '',
        date: new Date().toISOString().split('T')[0],
        minutes: 20,
      })
    }
  }, [isOpen])

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (field === 'minutes') {
      let value = Number.parseInt(e.target.value)
      if (value < 0) {
        return
      }
      if (value > MAX_MINUTES) {
        e.target.value = MAX_MINUTES.toString()
        value = MAX_MINUTES
      }
    }
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
    
    if (!formData.memberCode.trim() && !formData.memberName.trim()) {
      newErrors.memberCode = 'Código do membro ou nome do membro é obrigatório'
      newErrors.memberName = 'Código do membro ou nome do membro é obrigatório'
    }
    if (!formData.distritoId.trim()) {
      newErrors.distritoId = 'Distrito é obrigatório'
    }
    if (!formData.date) {
      newErrors.date = 'Data é obrigatório'
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
    
    httpClient.post<FormData, Daimoku>('/daimokus', formData)
      .then((response) => {
        if (response) {
          toast.success('Daimoku registrado com sucesso')
          setIsOpen(false)
        }
      })
      .catch((error) => {
        toast.error(error.response.data.error)
      }).finally(() => {
        setIsSubmitting(false)
      })
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const addDistrito = (distrito: Distrito) => {
    httpClient.post<Distrito, Distrito>('/distritos', distrito)
    .then((response) => {
      if (response) {
        setDistritos([...distritos, response].sort((a, b) => a.name.localeCompare(b.name)))
        toast.success('Distrito adicionado com sucesso')
      }
    })
    .catch((error) => {
      toast.error(error.response.data.error)
    })
  }

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text">Registrar Daimoku</h2>
        <p className="text-sm text-text-secondary mt-1">
          Preencha as informações para registrar daimoku
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="memberCode" className="block text-sm font-medium text-text mb-2">
            Código do Membro
          </label>
          <Input
            id="memberCode"
            type="text"
            value={formData.memberCode}
            onChange={handleInputChange('memberCode')}
            placeholder="Digite o código do membro"
            hasError={!!errors.memberCode}
            className="w-full"
          />
          {errors.memberCode && (
            <p className="text-red-500 text-xs mt-1">{errors.memberCode}</p>
          )}
        </div>

        <div>
          <label htmlFor="memberName" className="block text-sm font-medium text-text mb-2">
            Nome do Membro
          </label>
          <Input
            id="memberName"
            type="text"
            value={formData.memberName}
            onChange={handleInputChange('memberName')}
            placeholder="Digite o nome do membro"
            hasError={!!errors.memberName}
            className="w-full"
          />
          {errors.memberName && (
            <p className="text-red-500 text-xs mt-1">{errors.memberName}</p>
          )}
        </div>

        <div>
          <label htmlFor="distrito" className="block text-sm font-medium text-text mb-2">
            Distrito *
          </label>
          <Select
            value={formData.distritoId}
            onValueChange={(value: string) => setFormData(prev => ({ ...prev, distritoId: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o distrito" />
            </SelectTrigger>
            <SelectContent>
              {distritos.map((distrito: Distrito) => (
                <SelectItem key={distrito.id} value={distrito.id}>
                  {distrito.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.distritoId && (
            <p className="text-red-500 text-xs mt-1">{errors.distritoId}</p>
          )}

          <span className="text-xs text-text-secondary mt-1">Não encontrou seu distrito? <Link to="" className="underline" onClick={() => setIsCreateDistritoModalOpen(true)}>Clique aqui para criar um novo distrito</Link></span>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text mb-2">Data *</label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange('date')}
            placeholder="Selecione a data"
            hasError={!!errors.date}
            className="w-full"
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label htmlFor="minutes" className="block text-sm font-medium text-text mb-2">Minutos *</label>
          <Input
            id="minutes"
            type="number"
            value={formData.minutes}
            onChange={handleInputChange('minutes')}
            placeholder="Digite o número de minutos"
            min={1}
            max={MAX_MINUTES}
            hasError={!!errors.minutes}
            className="w-full"
          />
          {errors.minutes && (
            <p className="text-red-500 text-xs mt-1">{errors.minutes}</p>
          )}
          <span className="text-xs text-text-secondary mt-1">O número máximo são {MAX_MINUTES} minutos. Para mais de {MAX_MINUTES} minutos, registre mais de um daimoku.</span>
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
            disabled={(!formData.memberCode.trim() && !formData.memberName.trim()) || !formData.distritoId.trim() || !formData.date.trim()}
            loadingText="Registrando..."
            onClick={handleSubmit}
          >
            Registrar Daimoku
          </ButtonComponent>
        </div>
      </form>
      <CreateDistritoModal
        isOpen={isCreateDistritoModalOpen}
        setIsOpen={setIsCreateDistritoModalOpen}
        addDistrito={addDistrito}
      />
    </div>
    </BaseModal>
  )
}