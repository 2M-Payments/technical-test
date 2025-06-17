import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>
        <strong style={{paddingLeft: 10}}>{label}</strong>
        <br />
        <input {...props} />
      </label>
    </div>
  );
}
