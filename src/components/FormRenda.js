import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IncomeForm = () => {
  const [month, setMonth] = useState('Janeiro');
  const [salary, setSalary] = useState('');
  const [dividends, setDividends] = useState('');
  const [investments, setInvestments] = useState('');
  const [extraIncome, setExtraIncome] = useState('');
  const [incomes, setIncomes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Carrega os dados salvos ao iniciar o componente
    loadIncomes();
  }, []);

  useEffect(() => {
    // Salva os dados sempre que 'incomes' mudar
    saveIncomes();
  }, [incomes]);

  const loadIncomes = async () => {
    try {
      const storedIncomes = await AsyncStorage.getItem('@incomes');
      if (storedIncomes) {
        setIncomes(JSON.parse(storedIncomes));
      }
    } catch (error) {
      console.log('Erro ao carregar os dados:', error);
    }
  };

  const saveIncomes = async () => {
    try {
      await AsyncStorage.setItem('@incomes', JSON.stringify(incomes));
    } catch (error) {
      console.log('Erro ao salvar os dados:', error);
    }
  };

  const handleSubmit = () => {
    if (!salary || !dividends || !investments || !extraIncome) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const newIncome = {
      month,
      salary: parseFloat(salary),
      dividends: parseFloat(dividends),
      investments: parseFloat(investments),
      extraIncome: parseFloat(extraIncome),
    };

    setIncomes(prevIncomes => {
      const existingIndex = prevIncomes.findIndex(income => income.month === month);
      if (existingIndex >= 0) {
        const updatedIncomes = [...prevIncomes];
        updatedIncomes[existingIndex] = newIncome;
        return updatedIncomes;
      }
      return [...prevIncomes, newIncome];
    });

    // Reset fields
    setSalary('');
    setDividends('');
    setInvestments('');
    setExtraIncome('');

    // Oculta o formulário após enviar
    setIsFormVisible(false);
  };

  const handleDelete = (monthToDelete) => {
    setIncomes(prevIncomes => prevIncomes.filter(income => income.month !== monthToDelete));
  };

  const calculateTotalIncome = (income) => {
    return income.salary + income.dividends + income.investments + income.extraIncome;
  };

  const renderIncomeItem = ({ item }) => (
    <View style={styles.incomeItem}>
      <Text>Mês: {item.month}</Text>
      <Text>Salário: R${item.salary.toFixed(2)}</Text>
      <Text>Dividendos: R${item.dividends.toFixed(2)}</Text>
      <Text>Investimentos: R${item.investments.toFixed(2)}</Text>
      <Text>Renda Extra: R${item.extraIncome.toFixed(2)}</Text>
      <Text>Total: R${calculateTotalIncome(item).toFixed(2)}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.month)}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  const totalIncome = incomes.reduce((acc, income) => acc + calculateTotalIncome(income), 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={incomes.sort((a, b) => {
          const monthsOrder = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril',
            'Maio', 'Junho', 'Julho', 'Agosto',
            'Setembro', 'Outubro', 'Novembro', 'Dezembro'
          ];
          return monthsOrder.indexOf(b.month) - monthsOrder.indexOf(a.month);
        })}
        renderItem={renderIncomeItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

      {isFormVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registrar Renda Mensal</Text>
          <Picker
            selectedValue={month}
            style={styles.picker}
            onValueChange={(itemValue) => setMonth(itemValue)}
          >
            {[
              'Janeiro', 'Fevereiro', 'Março', 'Abril',
              'Maio', 'Junho', 'Julho', 'Agosto',
              'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ].map((monthName) => (
              <Picker.Item key={monthName} label={monthName} value={monthName} />
            ))}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Salário"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />
          <TextInput
            style={styles.input}
            placeholder="Dividendos"
            keyboardType="numeric"
            value={dividends}
            onChangeText={setDividends}
          />
          <TextInput
            style={styles.input}
            placeholder="Investimentos"
            keyboardType="numeric"
            value={investments}
            onChangeText={setInvestments}
          />
          <TextInput
            style={styles.input}
            placeholder="Renda Extra"
            keyboardType="numeric"
            value={extraIncome}
            onChangeText={setExtraIncome}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => setIsFormVisible(prev => !prev)}>
        <Text style={styles.buttonText}>{isFormVisible ? "Cancelar" : "Cadastrar Renda"}</Text>
      </TouchableOpacity>

      {isFormVisible && (
        <Button title="Salvar" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  incomeItem: {
    padding: 10,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  list: {
    marginTop: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 3,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default IncomeForm;
