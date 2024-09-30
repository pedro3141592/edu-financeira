import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormGasto = () => {
  const [month, setMonth] = useState('Janeiro');
  const [rent, setRent] = useState('');
  const [food, setFood] = useState('');
  const [transport, setTransport] = useState('');
  const [health, setHealth] = useState('');
  const [education, setEducation] = useState('');
  const [leisure, setLeisure] = useState('');
  const [others, setOthers] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Carrega os dados salvos ao iniciar o componente
    loadExpenses();
  }, []);

  useEffect(() => {
    // Salva os dados sempre que 'expenses' mudar
    saveExpenses();
  }, [expenses]);

  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('@expenses');
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
    } catch (error) {
      console.log('Erro ao carregar os dados:', error);
    }
  };

  const saveExpenses = async () => {
    try {
      await AsyncStorage.setItem('@expenses', JSON.stringify(expenses));
    } catch (error) {
      console.log('Erro ao salvar os dados:', error);
    }
  };

  const handleSubmit = () => {
    if (!rent || !food || !transport || !health || !education || !leisure || !others) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const newExpense = {
      month,
      rent: parseFloat(rent),
      food: parseFloat(food),
      transport: parseFloat(transport),
      health: parseFloat(health),
      education: parseFloat(education),
      leisure: parseFloat(leisure),
      others: parseFloat(others),
    };

    setExpenses(prevExpenses => {
      const existingIndex = prevExpenses.findIndex(expense => expense.month === month);
      if (existingIndex >= 0) {
        const updatedExpenses = [...prevExpenses];
        updatedExpenses[existingIndex] = newExpense;
        return updatedExpenses;
      }
      return [...prevExpenses, newExpense];
    });

    // Reset fields
    setRent('');
    setFood('');
    setTransport('');
    setHealth('');
    setEducation('');
    setLeisure('');
    setOthers('');
    
    // Ocultar o formulário após o cadastro
    setIsFormVisible(false);
  };

  const handleDelete = (monthToDelete) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.month !== monthToDelete));
  };

  const calculateTotalExpense = (expense) => {
    return expense.rent + expense.food + expense.transport + expense.health + expense.education + expense.leisure + expense.others;
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text>Mês: {item.month}</Text>
      <Text>Aluguéis: R${item.rent.toFixed(2)}</Text>
      <Text>Alimentação: R${item.food.toFixed(2)}</Text>
      <Text>Transporte: R${item.transport.toFixed(2)}</Text>
      <Text>Saúde: R${item.health.toFixed(2)}</Text>
      <Text>Educação: R${item.education.toFixed(2)}</Text>
      <Text>Lazer: R${item.leisure.toFixed(2)}</Text>
      <Text>Outros: R${item.others.toFixed(2)}</Text>
      <Text>Total: R${calculateTotalExpense(item).toFixed(2)}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.month)}>
        <Text style={styles.deleteButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

      {isFormVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registrar Gastos Mensais</Text>
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
            placeholder="Aluguéis"
            keyboardType="numeric"
            value={rent}
            onChangeText={setRent}
          />
          <TextInput
            style={styles.input}
            placeholder="Alimentação"
            keyboardType="numeric"
            value={food}
            onChangeText={setFood}
          />
          <TextInput
            style={styles.input}
            placeholder="Transporte"
            keyboardType="numeric"
            value={transport}
            onChangeText={setTransport}
          />
          <TextInput
            style={styles.input}
            placeholder="Saúde"
            keyboardType="numeric"
            value={health}
            onChangeText={setHealth}
          />
          <TextInput
            style={styles.input}
            placeholder="Educação"
            keyboardType="numeric"
            value={education}
            onChangeText={setEducation}
          />
          <TextInput
            style={styles.input}
            placeholder="Lazer"
            keyboardType="numeric"
            value={leisure}
            onChangeText={setLeisure}
          />
          <TextInput
            style={styles.input}
            placeholder="Outros"
            keyboardType="numeric"
            value={others}
            onChangeText={setOthers}
          />
          <Button title="Salvar" onPress={handleSubmit} />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={() => setIsFormVisible(prev => !prev)}>
        <Text style={styles.buttonText}>{isFormVisible ? "Cancelar" : "Cadastrar Gastos"}</Text>
      </TouchableOpacity>
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
  expenseItem: {
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

export default FormGasto;
