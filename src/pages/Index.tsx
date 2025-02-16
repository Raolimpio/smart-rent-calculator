
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Calculator, RotateCcw } from "lucide-react";

const steps = [
  "investmentCost",
  "currentRental",
  "returnAndLifespan",
  "occupancyRate",
  "risksAndLosses",
  "revenue",
  "expenses",
  "results"
];

export default function RentalCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    investmentCost: "", // Custo do investimento
    currentRental: "", // Valor atual de locação
    desiredReturn: "", // Rentabilidade desejada
    lifespan: "", // Vida útil estimada
    occupancyRate: "", // Taxa de ocupação
    risksAndLosses: "", // Riscos e perdas
    defaultRate: "", // Taxa de inadimplência
    totalRevenue: "", // Faturamento total
    fixedCosts: "", // Custos fixos
  });

  const [results, setResults] = useState({
    monthsInRental: 0, // Meses em locação
    risksAndLossesResult: 0, // Resultado riscos e perdas
    defaultRateResult: 0, // Resultado inadimplência
    desiredReturnValue: 0, // Rentabilidade desejada
    equipmentPaymentValue: 0, // Valor para pagar equipamento
    replacementValue: 0, // Valor para repor equipamento
    acquisitionAndReplacementCosts: 0, // Soma custos aquisição e reposição
    investmentsAndCosts: 0, // Investimentos + reposição + custos
    finalRisksAndLosses: 0, // Riscos e perdas finais
    finalDefaultRate: 0, // Inadimplência final
    operationalCosts: 0, // Custos operacionais
    suggestedRentalValue: 0, // Valor sugerido para locação
    profitLoss: 0, // Ganho/Prejuízo
    currentSuggestedDifference: 0, // Diferença entre valor atual e sugerido
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateResults = () => {
    const investmentCost = parseFloat(formData.investmentCost);
    const currentRental = parseFloat(formData.currentRental);
    const desiredReturn = parseFloat(formData.desiredReturn) / 100;
    const lifespan = parseInt(formData.lifespan);
    const occupancyRate = parseFloat(formData.occupancyRate) / 100;
    const risksAndLosses = parseFloat(formData.risksAndLosses) / 100;
    const defaultRate = parseFloat(formData.defaultRate) / 100;
    const totalRevenue = parseFloat(formData.totalRevenue);
    const fixedCosts = parseFloat(formData.fixedCosts);

    // Cálculos conforme formulário original
    const monthsInRental = lifespan;
    const monthlyDepreciation = investmentCost / lifespan;
    const monthlyReturn = investmentCost * desiredReturn;
    const operationalCosts = (investmentCost * occupancyRate) / 100;
    
    const replacementValue = monthlyDepreciation;
    const acquisitionAndReplacementCosts = replacementValue * 2;
    
    const risksAndLossesResult = risksAndLosses / 12;
    const defaultRateResult = defaultRate / 12;
    
    const finalRisksAndLosses = investmentCost * risksAndLossesResult;
    const finalDefaultRate = currentRental * defaultRateResult;
    
    const costRatio = fixedCosts / totalRevenue;
    const baseValue = acquisitionAndReplacementCosts / (1 - costRatio);
    
    const suggestedRentalValue = baseValue + monthlyReturn + finalRisksAndLosses;
    const profitLoss = currentRental - suggestedRentalValue;
    const currentSuggestedDifference = currentRental - suggestedRentalValue;

    setResults({
      monthsInRental,
      risksAndLossesResult,
      defaultRateResult,
      desiredReturnValue: monthlyReturn,
      equipmentPaymentValue: monthlyDepreciation,
      replacementValue,
      acquisitionAndReplacementCosts,
      investmentsAndCosts: baseValue,
      finalRisksAndLosses,
      finalDefaultRate,
      operationalCosts,
      suggestedRentalValue,
      profitLoss,
      currentSuggestedDifference
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        calculateResults();
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setFormData({
      investmentCost: "",
      currentRental: "",
      desiredReturn: "",
      lifespan: "",
      occupancyRate: "",
      risksAndLosses: "",
      defaultRate: "",
      totalRevenue: "",
      fixedCosts: "",
    });
    setCurrentStep(0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Custo do Investimento</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <Input
                  type="number"
                  placeholder="Ex: 4500"
                  className="pl-8"
                  value={formData.investmentCost}
                  onChange={(e) => handleInputChange("investmentCost", e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Valor total investido no equipamento
              </p>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Valor Atual de Locação
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <Input
                  type="number"
                  placeholder="Ex: 450"
                  className="pl-8"
                  value={formData.currentRental}
                  onChange={(e) => handleInputChange("currentRental", e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Valor atual cobrado pela locação
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Rentabilidade Desejada
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 10"
                  className="pr-8"
                  value={formData.desiredReturn}
                  onChange={(e) => handleInputChange("desiredReturn", e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">Por mês</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vida Útil Estimada</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 60"
                  className="pr-16"
                  value={formData.lifespan}
                  onChange={(e) => handleInputChange("lifespan", e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500">
                  meses
                </span>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Ocupação</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 70"
                  className="pr-8"
                  value={formData.occupancyRate}
                  onChange={(e) => handleInputChange("occupancyRate", e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
              <p className="text-sm text-gray-500">
                Percentual do tempo que o equipamento fica locado
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Riscos e Perdas</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 5"
                  className="pr-8"
                  value={formData.risksAndLosses}
                  onChange={(e) => handleInputChange("risksAndLosses", e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Taxa de Inadimplência</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ex: 3"
                  className="pr-8"
                  value={formData.defaultRate}
                  onChange={(e) => handleInputChange("defaultRate", e.target.value)}
                />
                <span className="absolute right-3 top-2.5 text-gray-500">%</span>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Faturamento Total</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <Input
                  type="number"
                  placeholder="Ex: 100000"
                  className="pl-8"
                  value={formData.totalRevenue}
                  onChange={(e) => handleInputChange("totalRevenue", e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Faturamento anual da sua locadora
              </p>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Despesas e Custos Fixos
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">R$</span>
                <Input
                  type="number"
                  placeholder="Ex: 45000"
                  className="pl-8"
                  value={formData.fixedCosts}
                  onChange={(e) => handleInputChange("fixedCosts", e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                Total mensal de despesas da empresa
              </p>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
              <h3 className="text-lg font-semibold mb-4">
                Valor Sugerido para Locação
              </h3>
              <p className="text-3xl font-bold mb-6">
                {formatCurrency(results.suggestedRentalValue)}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h6 className="text-sm mb-2">Valor Atual</h6>
                  <p className="text-xl font-semibold">
                    {formatCurrency(parseFloat(formData.currentRental))}
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h6 className="text-sm mb-2">Diferença</h6>
                  <p className="text-xl font-semibold">
                    {formatCurrency(results.currentSuggestedDifference)}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h6 className="text-sm mb-2">Detalhamento dos Custos</h6>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Depreciação Mensal:</span>
                      <span>{formatCurrency(results.equipmentPaymentValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rentabilidade:</span>
                      <span>{formatCurrency(results.desiredReturnValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Riscos e Perdas:</span>
                      <span>{formatCurrency(results.finalRisksAndLosses)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inadimplência:</span>
                      <span>{formatCurrency(results.finalDefaultRate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <img
            src="https://www.jotform.com/uploads/rafaelcsmarilia/form_files/banner%20ilustra%C3%A7%C3%A3o%20c%C3%A1lculo%20de%20loca%C3%A7%C3%A3o.622f7c7be31da8.98104709.jpg"
            alt="ALEC"
            className="w-32 h-32 mx-auto object-cover rounded-2xl mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Calculadora de Locação
          </h1>
          <p className="text-gray-600 mt-2">
            Calcule o valor ideal para sua locação de equipamentos
          </p>
        </div>

        <Progress value={progress} className="h-2" />

        <Card className="p-6">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 ml-auto"
              >
                Continuar <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2 ml-auto"
              >
                <RotateCcw className="w-4 h-4" /> Novo Cálculo
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
