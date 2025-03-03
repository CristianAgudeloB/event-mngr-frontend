import React from 'react';

interface AuthFormProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, submitButtonText, footer, children }) => {
  return (
    <div>
      <header className="main-header">
        <div className="header-content">
          <h1 className="app-title">Gestor de Eventos</h1>
        </div>
      </header>

      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">{title}</h2>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {children}
          <button type="submit" className="btn-primary">
            {submitButtonText}
          </button>
        </form>

        <div className="auth-footer">{footer}</div>
      </div>
    </div>
  );
};

export default AuthForm;
