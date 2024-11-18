import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConstructionCreate from "./ConstructionCreate";
import { supabase } from "../../../supabaseClient";

// Mock do Supabase
jest.mock("../../../supabaseClient", () => {
    return {
      supabase: {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn(),
      },
    };
  });
  
  describe("ConstructionCreate Component", () => {
    const mockOnClose = jest.fn();
    const mockOnConstructionCreated = jest.fn();
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it("Deve renderizar o formulário corretamente", () => {
      render(<ConstructionCreate onClose={mockOnClose} onConstructionCreated={mockOnConstructionCreated} />);
  
      // Verifica se os campos estão presentes
      expect(screen.getByText(/Código/i)).toBeInTheDocument();
      expect(screen.getByText(/Apelido/i)).toBeInTheDocument();
      expect(screen.getByText(/Endereço/i)).toBeInTheDocument();
  
      // Verifica os botões
      expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
    });
  
    it("Deve cadastrar uma obra com sucesso", async () => {
      // Mockando a função insert do supabase para retornar sucesso
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValueOnce({ data: {}, error: null }),
      });
  
      render(<ConstructionCreate onClose={mockOnClose} onConstructionCreated={mockOnConstructionCreated} />);
  
      // Preenche o formulário usando os labels
      fireEvent.change(screen.getByLabelText(/Código/i), { target: { value: "001" } });
      fireEvent.change(screen.getByLabelText(/Apelido/i), { target: { value: "Obra Teste" } });
      fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: "Rua Teste" } });
  
      // Clica no botão Cadastrar
      fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
  
      // Espera que a função insert seja chamada corretamente
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("construction");
        expect(supabase.from().insert).toHaveBeenCalledWith(
          [{ code: "001", name: "Obra Teste", address: "Rua Teste" }],
          { returning: "minimal" }
        );
      });
  
      // Verifica se as funções de callback foram chamadas
      expect(mockOnConstructionCreated).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  
    it("Deve lidar com erro ao cadastrar obra", async () => {
      // Mock do console.error para verificar se ele é chamado
      const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
      // Mock do Supabase
      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValueOnce({ data: null, error: { message: "Erro ao cadastrar" } }),
      });
    
      // Renderiza o componente
      render(<ConstructionCreate onClose={mockOnClose} onConstructionCreated={mockOnConstructionCreated} />);
      
      // Simula o preenchimento do formulário
      fireEvent.change(screen.getByLabelText(/Código/i), { target: { value: "001" } });
      fireEvent.change(screen.getByLabelText(/Apelido/i), { target: { value: "Obra Teste" } });
      fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: "Rua Teste" } });
    
      // Simula o clique no botão de cadastrar
      fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    
      // Aguarda e verifica se as funções foram chamadas corretamente
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("construction");
        expect(supabase.from().insert).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Error inserting data:", "Erro ao cadastrar");
      });
    
      // Restaura o console.error original após o teste
      consoleErrorMock.mockRestore();
    });
    
    it("Deve fechar o modal ao clicar em cancelar", () => {
      render(<ConstructionCreate onClose={mockOnClose} onConstructionCreated={mockOnConstructionCreated} />);
      
      fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
      
      expect(mockOnClose).toHaveBeenCalled(); // Verifica se a função de fechar foi chamada
    });
  });
  
