// app/components/EditModal.tsx
import React, { useState } from 'react';
import './EditModal.css';

interface EditModalProps {
  field: 'firstName' | 'lastName' | 'phone' | 'username' | 'email';
  currentValue: string;
  onSave: (updatedValue: string) => void;
  onCancel: () => void;
}

const fieldNames = {
  firstName: 'Nombre',
  lastName: 'Apellido',
  phone: 'Teléfono',
  username: 'Usuario',
  email: 'Correo Electrónico'
};

const EditModal: React.FC<EditModalProps> = ({ field, currentValue, onSave, onCancel }) => {
  const [value, setValue] = useState(currentValue);

  const handleSave = () => {
    onSave(value);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Cambiar {fieldNames[field]}</h3>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={handleSave}>GUARDAR</button>
        <button onClick={onCancel}>CANCELAR</button>
      </div>
    </div>
  );
};

export default EditModal;
