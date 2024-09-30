import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from "react-native-chart-kit";

export default function FinancialInfo() {
    const [dollarRate, setDollarRate] = useState(null);
    const [selicRate, setSelicRate] = useState(null);
    const [inflationRate, setInflationRate] = useState(null);
    const [inflationData, setInflationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cotação do dólar
                const dollarResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
                const dollarJson = await dollarResponse.json();
                setDollarRate(dollarJson.rates.BRL);

                // Taxa Selic
                const selicResponse = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json');
                const selicJson = await selicResponse.json();
                const currentSelic = selicJson[selicJson.length - 1]; // Último valor
                setSelicRate(currentSelic.valor);

                // Inflação (IPCA) do último mês e dados dos últimos 6 meses
                const inflationResponse = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json');
                const inflationJson = await inflationResponse.json();
                const lastInflation = inflationJson.slice(-1)[0]; // Último valor
                setInflationRate(lastInflation.valor);

                // Pegando os últimos 6 meses de inflação
                const lastSixMonthsInflation = inflationJson.slice(-6).map(item => parseFloat(item.valor));
                setInflationData(lastSixMonthsInflation);

                // Atualiza os nomes dos meses, retrocedendo um mês
                const monthNames = [];
                for (let i = 0; i < 6; i++) {
                    const monthIndex = new Date(new Date().setMonth(new Date().getMonth() - (i + 1))).getMonth();
                    monthNames.unshift(new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(new Date().setMonth(monthIndex))));
                }
                setMonths(monthNames);
            } catch (error) {
                console.error("Erro ao buscar os dados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dados Financeiros</Text>
            <Text style={styles.item}>Cotação do Dólar (Hoje): R$ {dollarRate.toFixed(2)}</Text>
            <Text style={styles.item}>Inflação (último mês): {inflationRate}%</Text>
            
            <Text style={styles.graphTitle}>Inflação nos Últimos 6 Meses</Text>
            <LineChart
                data={{
                    labels: months,
                    datasets: [
                        {
                            data: inflationData,
                        },
                    ],
                }}
                width={350} // largura do gráfico
                height={220} // altura do gráfico
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 2, // casas decimais
                    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726",
                    },
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        position: "relative",
        padding: 20,
        backgroundColor: '#f7f7f7',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginHorizontal: 10, // Ajusta a margem horizontal
        marginVertical: 0, // Mantém a margem vertical
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        fontSize: 18,
        marginVertical: 5,
    },
    graphTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
});
