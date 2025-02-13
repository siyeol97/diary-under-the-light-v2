type Menu = {
  id: number;
  name: string;
  icon: string;
  href: string;
};

interface VoiceDepressResultType {
  depress: string;
  sigmoid_value: number;
}

export type { Menu, VoiceDepressResultType };
