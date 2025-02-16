import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowRight,
  ArrowLeft,
  Calculator,
  RotateCcw,
  DollarSign,
  Percent,
  Calendar,
  Users,
  AlertTriangle,
  Building,
  PiggyBank,
} from "lucide-react";

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
  const isMobile = useIsMobile();
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-primary/10 flex items-center justify-center`}>
                <DollarSign className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-primary`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Custo do Investimento</h2>
                <p className="mui-body">Digite o valor total investido no equipamento</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">R$</span>
                  <Input
                    type="number"
                    placeholder="Ex: 4500"
                    className="pl-10 h-12 md:h-14 text-base md:text-lg rounded-xl border-gray-200"
                    value={formData.investmentCost}
                    onChange={(e) => handleInputChange("investmentCost", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                <Calendar className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Valor Atual de Locação</h2>
                <p className="mui-body">Valor atual cobrado pela locação</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">R$</span>
                  <Input
                    type="number"
                    placeholder="Ex: 450"
                    className="pl-10 h-12 md:h-14 text-base md:text-lg rounded-xl border-gray-200"
                    value={formData.currentRental}
                    onChange={(e) => handleInputChange("currentRental", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                <Percent className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Rentabilidade Desejada</h2>
                <p className="mui-body">Por mês</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
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
              </div>
            </div>

            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
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
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                <Percent className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Taxa de Ocupação</h2>
                <p className="mui-body">Percentual do tempo que o equipamento fica locado</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
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
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                <AlertTriangle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Riscos e Perdas</h2>
                <p className="mui-body">%</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
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
            </div>

            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
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
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                <DollarSign className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Faturamento Total</h2>
                <p className="mui-body">Faturamento anual da sua locadora</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">R$</span>
                  <Input
                    type="number"
                    placeholder="Ex: 100000"
                    className="pl-10 h-12 md:h-14 text-base md:text-lg rounded-xl border-gray-200"
                    value={formData.totalRevenue}
                    onChange={(e) => handleInputChange("totalRevenue", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                <DollarSign className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              </div>
              <div>
                <h2 className={`mui-title ${isMobile ? 'text-xl' : 'text-2xl'}`}>Despesas e Custos Fixos</h2>
                <p className="mui-body">Total mensal de despesas da empresa</p>
              </div>
            </div>
            
            <div className="mui-card p-4 md:p-6">
              <div className="mui-input-wrapper">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400">R$</span>
                  <Input
                    type="number"
                    placeholder="Ex: 45000"
                    className="pl-10 h-12 md:h-14 text-base md:text-lg rounded-xl border-gray-200"
                    value={formData.fixedCosts}
                    onChange={(e) => handleInputChange("fixedCosts", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="mui-result-card p-4 md:p-8">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-white/10 flex items-center justify-center`}>
                  <Calculator className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                </div>
                <div>
                  <h3 className={`font-medium ${isMobile ? 'text-xl' : 'text-2xl'}`}>Resultado Final</h3>
                  <p className="text-white/80 text-sm md:text-base">Análise completa do investimento</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="text-center p-4 md:p-6 bg-white/5 rounded-xl md:rounded-2xl backdrop-blur-sm">
                  <h4 className="text-base md:text-lg font-medium mb-2">Valor Sugerido</h4>
                  <p className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold tracking-tight mb-2`}>
                    {formatCurrency(results.suggestedRentalValue)}
                  </p>
                  <p className="text-white/60 text-sm">valor mensal recomendado</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="mui-stat-card">
                    <h6 className="text-white/60 text-sm mb-1 md:mb-2">Valor Atual</h6>
                    <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>
                      {formatCurrency(parseFloat(formData.currentRental))}
                    </p>
                  </div>
                  <div className="mui-stat-card">
                    <h6 className="text-white/60 text-sm mb-1 md:mb-2">Diferença</h6>
                    <p className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>
                      {formatCurrency(results.currentSuggestedDifference)}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-sm">
                  <h6 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-4 md:mb-6`}>Detalhamento</h6>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 md:gap-3">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                        <span className="text-sm md:text-base">Depreciação Mensal</span>
                      </span>
                      <span className="font-medium text-sm md:text-base">
                        {formatCurrency(results.equipmentPaymentValue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 md:gap-3">
                        <PiggyBank className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                        <span className="text-sm md:text-base">Rentabilidade</span>
                      </span>
                      <span className="font-medium text-sm md:text-base">
                        {formatCurrency(results.desiredReturnValue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 md:gap-3">
                        <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                        <span className="text-sm md:text-base">Riscos e Perdas</span>
                      </span>
                      <span className="font-medium text-sm md:text-base">
                        {formatCurrency(results.finalRisksAndLosses)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 md:gap-3">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
                        <span className="text-sm md:text-base">Inadimplência</span>
                      </span>
                      <span className="font-medium text-sm md:text-base">
                        {formatCurrency(results.finalDefaultRate)}
                      </span>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="w-full max-w-2xl mx-auto px-4 py-6 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} mx-auto bg-white rounded-2xl shadow-lg p-4 mb-4 md:mb-6 transform rotate-12`}>
            <img
              src="https://www.jotform.com/uploads/rafaelcsmarilia/form_files/banner%20ilustra%C3%A7%C3%A3o%20c%C3%A1lculo%20de%20loca%C3%A7%C3%A3o.622f7c7be31da8.98104709.jpg"
              alt="ALEC"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 tracking-tight mb-2 md:mb-3`}>
            Calculadora de Locação
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Calcule o valor ideal para sua locação de equipamentos
          </p>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="mui-stepper">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`mui-step ${
                  index === currentStep ? "mui-step-active" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="mui-card p-4 md:p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          <div className="flex justify-between mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-100">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2 h-10 md:h-12 px-4 md:px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                Voltar
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 ml-auto h-10 md:h-12 px-4 md:px-6 rounded-xl bg-primary hover:bg-primary/90"
              >
                Continuar
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2 ml-auto h-10 md:h-12 px-4 md:px-6 rounded-xl"
              >
                <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                Novo Cálculo
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
