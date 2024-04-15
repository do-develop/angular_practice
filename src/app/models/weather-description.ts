export interface WeatherDescription {
    [code: string]: {
      day: {
        description: string;
        image: string;
      };
      night: {
        description: string;
        image: string;
      };
    };
  }
  