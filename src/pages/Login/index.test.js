import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Home from './index';
import Login from './index';
import { supabase } from '../../../supabaseClient';
import { useNavigate } from 'react-router-dom';

afterEach(cleanup);

// Mock da função alert
beforeAll(() => {
    window.alert = jest.fn();
  });

jest.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpar mocks antes de cada teste
  });

  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
  
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('Renderiza o formulário de login corretamente', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument();
  });

  test('Exibe erro ao falhar no login', async () => {
    // Erro de login
    supabase.auth.signInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_incorreta' } });
    fireEvent.click(screen.getByText(/Entrar/i));

    await waitFor(() => {
      expect(screen.getByText(/Invalid login credentials/i)).toBeInTheDocument();
    });
  });

  test('Login bem-sucedido navega para a página inicial', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    supabase.auth.signInWithPassword.mockResolvedValue({
      error: null,
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_correta' } });
    fireEvent.click(screen.getByText(/Entrar/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('Renderiza o formulário de registro quando o modo de registro é ativado', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  
    fireEvent.click(screen.getByText(/Criar nova conta/i)); 
  
    expect(screen.getByRole('button', { name: /Registrar/i })).toBeInTheDocument();
  });  

  test('Exibe erro ao falhar no registro', async () => {
    // Simula erro de registro
    supabase.auth.signUp.mockResolvedValue({
      error: { message: 'Email já cadastrado' },
    });
  
    render(
      <Router>
        <Login />
      </Router>
    );
  
    fireEvent.click(screen.getByText(/Criar nova conta/i)); 
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_fraca' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Email já cadastrado/i)).toBeInTheDocument();
    });
  });
  
  test('Registro bem-sucedido exibe mensagem de confirmação', async () => {
  // Mock para simular sucesso no registro
  supabase.auth.signUp.mockResolvedValue({
    user: { id: 'novo-usuario' },
    error: null,
  });

  render(
    <Router>
      <Login />
    </Router>
  );

  fireEvent.click(screen.getByText(/Criar nova conta/i));
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'novo@exemplo.com' } });
  fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_segura' } });
  fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
      "Conta criada com sucesso. Verifique seu e-mail para confirmar sua conta."
    );
  });
});

test('Exibe mensagem de erro se o e-mail estiver inválido', async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /Criar nova conta/i }));
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@exemplo' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_segura' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));
    
    expect(await screen.findByText(/O campo e-mail é inválido/i)).toBeInTheDocument();
});

test('Exibe mensagem de erro se a senha estiver inválida', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /Criar nova conta/i }));
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrar/i }));

    expect(await screen.findByText(/O campo senha é inválido/i)).toBeInTheDocument();
});

test('Exibe erro ao inserir credenciais inválidas', async () => {
    // Simula um erro de login
    supabase.auth.signInWithPassword.mockResolvedValue({
      user: null,
      error: { message: 'Credenciais inválidas' },
    });
  
    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'email@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_errada' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));
  
    expect(await screen.findByText(/Credenciais inválidas/i)).toBeInTheDocument();
  });

  test('Exibe a mensagem "Carregando..." durante o login', async () => {
    // Mock para simular delay no login
    supabase.auth.signInWithPassword = jest.fn().mockImplementation(() =>
        new Promise((resolve) => setTimeout(() => resolve({ user: { id: 'usuario-123' }, error: null }), 500))
    );

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'email@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'senha_segura' } });
    fireEvent.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument());

    expect(window.location.pathname).toBe('/');

});

});
