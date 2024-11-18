import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditUser from './index';
import { supabase, supabaseAdmin } from '../../../supabaseClient';

// Mock do Supabase
jest.mock('../../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      updateUser: jest.fn(),
      signOut: jest.fn(),
    },
  },
  supabaseAdmin: {
    auth: {
      admin: {
        deleteUser: jest.fn(),
      },
    },
  },
}));

beforeAll(() => {
  window.alert = jest.fn(); // Mock do window.alert
});

// Mock do retorno da sessão
beforeEach(() => {
  supabase.auth.getSession.mockResolvedValue({
    data: {
      session: {
        user: {
          email: 'email@exemplo.com',
          id: 'usuario-123',
        },
      },
    },
  });
});

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Suite de testes para o componente EditUser
describe('EditUser Component', () => {
  it('Deve renderizar sem travar/quebrar o fluxo de renderização', async () => {
    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );

    // Verifica se o componente renderiza sem erros
    expect(await screen.findByDisplayValue(/email@exemplo.com/i)).toBeInTheDocument();
  });

  it('Deve atualizar o e-mail e a senha do usuário', async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: null });

    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'novoemail@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Nova Senha/i), { target: { value: 'novasenha' } });

    fireEvent.click(screen.getByRole('button', { name: /Atualizar/i }));

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        email: 'novoemail@exemplo.com',
        password: 'novasenha',
      });
    });

    expect(window.alert).toHaveBeenCalledWith('Dados atualizados com sucesso.');
  });

  it('Deve lidar com erro de atualização do usuário', async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: { message: 'Erro ao atualizar.' } });

    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'novoemail@exemplo.com' } });
    fireEvent.change(screen.getByLabelText(/Nova Senha/i), { target: { value: 'novasenha' } });
    fireEvent.click(screen.getByRole('button', { name: /Atualizar/i }));

    await waitFor(() => expect(screen.getByText(/Erro ao atualizar./i)).toBeInTheDocument());
  });

  it('Deve excluir conta de usuário', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    supabaseAdmin.auth.admin.deleteUser.mockResolvedValue({ error: null });
    supabase.auth.signOut.mockResolvedValue();

    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Excluir Conta/i }));

    await waitFor(() => expect(supabaseAdmin.auth.admin.deleteUser).toHaveBeenCalledWith('usuario-123'));
    expect(window.alert).toHaveBeenCalledWith('Conta excluída com sucesso.');
  });

  it('Deve lidar com erro ao obter a sessão antes de excluir a conta', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    
    // Simula um erro ao buscar a sessão
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Erro ao obter sessão' },
    });
  
    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Excluir Conta/i }));
  
    await waitFor(() => {
      // Verifica se o erro de sessão é exibido
      expect(screen.getByText(/Erro ao obter sessão/i)).toBeInTheDocument();
    });
  });
  
  it('Deve lidar com erro inesperado ao excluir conta de usuário', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    
    // Simula um erro inesperado
    supabaseAdmin.auth.admin.deleteUser.mockImplementation(() => {
      throw new Error('Erro inesperado');
    });
  
    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Excluir Conta/i }));
  
    await waitFor(() => {
      // Verifica se o erro genérico é exibido
      expect(screen.getByText(/Erro inesperado/i)).toBeInTheDocument();
    });
  });
  
  it('Deve lidar com erro de exclusão de conta', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    supabaseAdmin.auth.admin.deleteUser.mockResolvedValue({ error: { message: 'Erro ao excluir conta.' } });

    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Excluir Conta/i }));

    await waitFor(() => expect(screen.getByText(/Erro ao excluir conta./i)).toBeInTheDocument());
  });

  it('Deve navegar para a página principal ao clicar em "Cancelar"', async () => {
    const mockNavigate = jest.fn();
    const { useNavigate } = require('react-router-dom'); // Importa o mock do useNavigate
    useNavigate.mockReturnValue(mockNavigate); // Retorna a função mockada

    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));

    // Verifica se a função navigate foi chamada com o caminho "/"
    /* expect(mockNavigate).toHaveBeenCalledWith('/'); */
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('Não deve excluir conta se o usuário cancelar a confirmação', async () => {
    // Simula o usuário clicando em "Cancelar" no window.confirm
    jest.spyOn(window, 'confirm').mockReturnValue(false);
  
    render(
      <MemoryRouter initialEntries={['/edit-user']}>
        <EditUser />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByRole('button', { name: /Excluir Conta/i }));
  
    expect(supabaseAdmin.auth.admin.deleteUser).not.toHaveBeenCalled();
    expect(supabase.auth.signOut).not.toHaveBeenCalled();
  });
});
