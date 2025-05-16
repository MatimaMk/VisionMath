import { MathQuestion, Recommendation } from "@/app/interfaces/mathTestTypes";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://edaiyqrxctozonsclcqt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYWl5cXJ4Y3Rvem9uc2NsY3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTMyMzQsImV4cCI6MjA2MTYyOTIzNH0.Z4T_Tk4QDNbs-COx83IfXn8Hud5f5sBaTgX9QIYYO40";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
  },
  global: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});

export type Database = {
  public: {
    Tables: {
      math_tests: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          topic: string;
          difficulty: string;
          questions: MathQuestion;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          topic: string;
          difficulty: string;
          questions: MathQuestion;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          topic?: string;
          difficulty?: string;
          questions?: MathQuestion;
          created_at?: string;
        };
      };
      math_test_results: {
        Row: {
          id: string;
          test_id: string;
          user_id: string;
          score: number;
          time_in_seconds: number;
          questions: MathQuestion;
          recommendations: Recommendation;
          completed_at: string;
        };
        Insert: {
          id?: string;
          test_id: string;
          user_id?: string;
          score: number;
          time_in_seconds: number;
          questions: MathQuestion;
          recommendations: Recommendation;
          completed_at?: string;
        };
        Update: {
          id?: string;
          test_id?: string;
          user_id?: string;
          score?: number;
          time_in_seconds?: number;
          questions?: MathQuestion;
          recommendations?: Recommendation;
          completed_at?: string;
        };
      };
    };
    // Add other tables as needed
  };
};
