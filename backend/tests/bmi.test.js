describe('BMI Calculator Tests', () => {
  
  // Core BMI calculation function
  const calculateBMI = (weight, height) => {
    if (height <= 0 || weight <= 0) {
      throw new Error('Height and weight must be positive');
    }
    return +(weight / (height * height)).toFixed(2);
  };

  // BMI category classification
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Data validation for API - Fixed validation order
  const validateBMIData = (data) => {
    const { id, height, weight, age, bmi } = data;
    
    if (!id || height === undefined || weight === undefined || age === undefined || bmi === undefined) {
      return { valid: false, error: 'Missing required fields' };
    }
    
    if (height <= 0 || weight <= 0 || age <= 0) {
      return { valid: false, error: 'Height, weight, and age must be positive numbers' };
    }
    
    return { valid: true };
  };

  // Mock API response structure
  const createBMIResponse = (data) => {
    const validation = validateBMIData(data);
    if (!validation.valid) {
      return {
        status: 400,
        body: { message: validation.error }
      };
    }
    
    return {
      status: 201,
      body: {
        id: data.id,
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        age: parseInt(data.age),
        bmi: parseFloat(data.bmi),
        category: getBMICategory(data.bmi),
        createdAt: new Date().toISOString()
      }
    };
  };

  describe('BMI Calculation Logic', () => {
    test('should calculate BMI correctly for normal weight', () => {
      const bmi = calculateBMI(70, 1.70);
      expect(bmi).toBe(24.22);
      expect(getBMICategory(bmi)).toBe('Normal weight');
    });

    test('should calculate BMI correctly for underweight', () => {
      const bmi = calculateBMI(55, 1.80);
      expect(bmi).toBe(16.98);
      expect(getBMICategory(bmi)).toBe('Underweight');
    });

    test('should calculate BMI correctly for overweight', () => {
      const bmi = calculateBMI(85, 1.70);
      expect(bmi).toBe(29.41);
      expect(getBMICategory(bmi)).toBe('Overweight');
    });

    test('should calculate BMI correctly for obese', () => {
      const bmi = calculateBMI(95, 1.70);
      expect(bmi).toBe(32.87);
      expect(getBMICategory(bmi)).toBe('Obese');
    });

    test('should handle decimal values correctly', () => {
      const bmi = calculateBMI(72.5, 1.75);
      expect(bmi).toBe(23.67);
      expect(getBMICategory(bmi)).toBe('Normal weight');
    });

    test('should return correct data types', () => {
      const bmi = calculateBMI(70, 1.70);
      expect(typeof bmi).toBe('number');
      expect(typeof getBMICategory(bmi)).toBe('string');
    });
  });

  describe('BMI Category Classification', () => {
    test('should classify underweight correctly', () => {
      expect(getBMICategory(17.5)).toBe('Underweight');
      expect(getBMICategory(18.4)).toBe('Underweight');
    });

    test('should classify normal weight correctly', () => {
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(22.0)).toBe('Normal weight');
      expect(getBMICategory(24.9)).toBe('Normal weight');
    });

    test('should classify overweight correctly', () => {
      expect(getBMICategory(25.0)).toBe('Overweight');
      expect(getBMICategory(27.0)).toBe('Overweight');
      expect(getBMICategory(29.9)).toBe('Overweight');
    });

    test('should classify obese correctly', () => {
      expect(getBMICategory(30.0)).toBe('Obese');
      expect(getBMICategory(35.0)).toBe('Obese');
      expect(getBMICategory(40.0)).toBe('Obese');
    });

    test('should handle boundary values correctly', () => {
      expect(getBMICategory(18.5)).toBe('Normal weight');
      expect(getBMICategory(25.0)).toBe('Overweight');
      expect(getBMICategory(30.0)).toBe('Obese');
    });
  });

  describe('Input Validation', () => {
    test('should throw error for zero height', () => {
      expect(() => calculateBMI(70, 0)).toThrow('Height and weight must be positive');
    });

    test('should throw error for negative weight', () => {
      expect(() => calculateBMI(-70, 1.75)).toThrow('Height and weight must be positive');
    });

    test('should throw error for zero weight', () => {
      expect(() => calculateBMI(0, 1.75)).toThrow('Height and weight must be positive');
    });

    test('should throw error for negative height', () => {
      expect(() => calculateBMI(70, -1.75)).toThrow('Height and weight must be positive');
    });
  });

  describe('API Data Validation', () => {
    test('should validate complete BMI data', () => {
      const validData = {
        id: 'test-1',
        height: 1.70,
        weight: 70,
        age: 25,
        bmi: 24.22
      };
      
      const result = validateBMIData(validData);
      expect(result.valid).toBe(true);
    });

    test('should reject data with missing required fields', () => {
      const invalidData = {
        height: 1.70,
        weight: 70
        // missing id, age, bmi
      };
      
      const result = validateBMIData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Missing required fields');
    });

    test('should reject data with invalid height', () => {
      const invalidData = {
        id: 'test-1',
        height: 0,
        weight: 70,
        age: 25,
        bmi: 24.22
      };
      
      const result = validateBMIData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Height, weight, and age must be positive numbers');
    });

    test('should reject data with negative values', () => {
      const invalidData = {
        id: 'test-1',
        height: 1.70,
        weight: -70,
        age: 25,
        bmi: 24.22
      };
      
      const result = validateBMIData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Height, weight, and age must be positive numbers');
    });
  });

  describe('Mock API Response Testing', () => {
    test('should create valid API response for normal weight', () => {
      const testData = {
        id: 'test-1',
        height: 1.70,
        weight: 70,
        age: 25,
        bmi: 24.22
      };

      const response = createBMIResponse(testData);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'test-1');
      expect(response.body).toHaveProperty('bmi', 24.22);
      expect(response.body).toHaveProperty('height', 1.70);
      expect(response.body).toHaveProperty('weight', 70);
      expect(response.body).toHaveProperty('age', 25);
      expect(response.body).toHaveProperty('category', 'Normal weight');
      expect(response.body).toHaveProperty('createdAt');
    });

    test('should return error response for missing fields', () => {
      const testData = {
        height: 1.70,
        weight: 70
        // missing id, age, bmi
      };

      const response = createBMIResponse(testData);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields');
    });

    test('should handle different BMI categories in responses', () => {
      const testCases = [
        { id: 'test-2', height: 1.80, weight: 55, age: 22, bmi: 16.98, expectedCategory: 'Underweight' },
        { id: 'test-3', height: 1.75, weight: 70, age: 25, bmi: 22.86, expectedCategory: 'Normal weight' },
        { id: 'test-4', height: 1.70, weight: 85, age: 30, bmi: 29.41, expectedCategory: 'Overweight' },
        { id: 'test-5', height: 1.70, weight: 95, age: 35, bmi: 32.87, expectedCategory: 'Obese' }
      ];

      testCases.forEach(testData => {
        const response = createBMIResponse(testData);
        expect(response.status).toBe(201);
        expect(response.body.bmi).toBe(testData.bmi);
        expect(response.body.category).toBe(testData.expectedCategory);
      });
    });
  });

  describe('Edge Cases and Real-world Scenarios', () => {
    test('should handle decimal precision correctly', () => {
      const bmi1 = calculateBMI(70.5, 1.75);
      const bmi2 = calculateBMI(70.7, 1.75);
      
      expect(bmi1).toBe(23.02);
      expect(bmi2).toBe(23.09);
      expect(bmi1).not.toBe(bmi2);
    });

    test('should handle extreme but valid BMI values', () => {
      // Very underweight
      const bmi1 = calculateBMI(40, 1.80);
      expect(bmi1).toBe(12.35);
      expect(getBMICategory(bmi1)).toBe('Underweight');

      // Very obese
      const bmi2 = calculateBMI(150, 1.70);
      expect(bmi2).toBe(51.9);
      expect(getBMICategory(bmi2)).toBe('Obese');
    });

    test('should maintain consistency across calculations', () => {
      const weight = 75;
      const height = 1.80;
      
      // Calculate multiple times
      const bmi1 = calculateBMI(weight, height);
      const bmi2 = calculateBMI(weight, height);
      const bmi3 = calculateBMI(weight, height);
      
      expect(bmi1).toBe(bmi2);
      expect(bmi2).toBe(bmi3);
      expect(bmi1).toBe(23.15);
    });
  });

  describe('Performance and Reliability', () => {
    test('should handle multiple calculations efficiently', () => {
      const startTime = Date.now();
      
      for (let i = 0; i < 1000; i++) {
        calculateBMI(70 + i * 0.1, 1.70 + i * 0.001);
      }
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('should maintain precision with various inputs', () => {
      const testCases = [
        { weight: 65.5, height: 1.68, expected: 23.21 },
        { weight: 82.3, height: 1.76, expected: 26.57 },
        { weight: 58.7, height: 1.62, expected: 22.37 },
        { weight: 91.2, height: 1.85, expected: 26.65 } // Fixed: actual calculated value
      ];

      testCases.forEach(testCase => {
        const bmi = calculateBMI(testCase.weight, testCase.height);
        expect(bmi).toBe(testCase.expected);
      });
    });
  });
});