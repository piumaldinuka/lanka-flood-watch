import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, Send, Loader2, Sparkles } from "lucide-react";
import { FloodData } from "@/types/flood";

interface FloodRiskAnalyzerProps {
  floodData: FloodData | undefined;
}

export const FloodRiskAnalyzer = ({ floodData }: FloodRiskAnalyzerProps) => {
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "Which areas are most at risk right now?",
    "What should residents in critical zones do?",
    "How does the current situation compare to typical flood levels?",
    "Which districts need immediate attention?"
  ];

  const handleAnalyze = async (customQuestion?: string) => {
    const queryQuestion = customQuestion || question;
    
    if (!queryQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!floodData) {
      toast.error("Waiting for flood data to load...");
      return;
    }

    setIsLoading(true);
    setAnalysis("");

    try {
      const { data, error } = await supabase.functions.invoke('analyze-flood-risk', {
        body: { question: queryQuestion, floodData }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setAnalysis(data.analysis);
      if (!customQuestion) {
        setQuestion("");
      }
    } catch (error: any) {
      console.error('Error analyzing flood risk:', error);
      toast.error("Failed to analyze flood risk. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          AI Flood Risk Analyzer
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </CardTitle>
        <CardDescription>
          Ask questions about flood risks and get AI-powered insights based on real-time data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Question</label>
          <Textarea
            placeholder="e.g., Which areas should evacuate immediately?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            className="min-h-[80px]"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Quick Questions</label>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuestion(q);
                  handleAnalyze(q);
                }}
                disabled={isLoading}
                className="text-xs"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={() => handleAnalyze()} 
          disabled={isLoading || !question.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Analyze Risk
            </>
          )}
        </Button>

        {analysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg border animate-in fade-in-50 slide-in-from-bottom-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI Analysis
            </h4>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {analysis}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
