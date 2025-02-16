
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Calculator, RotateCcw } from "lucide-react";

const steps = ["investmentCost", "currentRental", "returnAndLifespan", "results"];

export default function RentalCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    investmentCost: "",
    currentRental: "",
    desiredReturn: "",
    lifespan: "",
  });
  const [results, setResults] = useState({
    suggestedValue: 0,
    monthlyReturn: 0,
    currentValue: 0,
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

    const monthlyDepreciation = investmentCost / lifespan;
    const monthlyReturn = investmentCost * desiredReturn;
    const suggestedValue = monthlyDepreciation + monthlyReturn;

    setResults({
      suggestedValue,
      monthlyReturn: desiredReturn,
      currentValue: currentRental,
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
    });
    setCurrentStep(0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
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
            <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
              <h3 className="text-lg font-semibold mb-4">
                Valor Ideal de Locação
              </h3>
              <p className="text-3xl font-bold mb-6">
                {formatCurrency(results.suggestedValue)}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h6 className="text-sm mb-2">Rentabilidade Mensal</h6>
                  <p className="text-xl font-semibold">
                    {(results.monthlyReturn * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h6 className="text-sm mb-2">Valor Atual</h6>
                  <p className="text-xl font-semibold">
                    {formatCurrency(results.currentValue)}
                  </p>
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
