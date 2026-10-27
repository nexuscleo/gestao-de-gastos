# FinançasPro

Aplicação de gestão de gastos feita com React, Vite, Tailwind CSS e Recharts.
As transações são armazenadas localmente no navegador.

## Acompanhar parcelamentos e financiamentos

Abra a aba **Parcelamentos** e selecione **Novo parcelamento**. Informe o nome,
o tipo de despesa, o valor de cada parcela, a quantidade, a categoria e o
vencimento da primeira parcela. As demais datas são calculadas mensalmente,
preservando o dia do vencimento quando possível.

O total futuro fica visível em **Total a vencer**, mas não altera o saldo nem os
gráficos antes do pagamento. Use **Registrar pagamento** para lançar a próxima
parcela no histórico de despesas; o progresso e os vencimentos restantes são
atualizados automaticamente. Se excluir essa transação do histórico, a parcela
volta a ficar pendente. É possível encerrar o acompanhamento sem apagar as
parcelas já pagas.

Os parcelamentos e pagamentos são mantidos no armazenamento local do navegador,
assim como as demais transações.

## Requisitos

- Node.js 18 ou superior
- npm

## Executar localmente

```bash
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local para abrir no navegador.

## Gerar build de produção

```bash
npm run build
npm run preview
```
