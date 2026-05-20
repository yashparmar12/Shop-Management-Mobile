import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../../components/ui/Header';
import { Card } from '../../components/ui/Card';
import { dashboardService } from '../../services/dashboardService';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency } from '../../utils/format';

type ReportType = 'daily' | 'monthly';

export const ReportsScreen = () => {
  const { colors } = useTheme();
  const [type, setType] = useState<ReportType>('daily');

  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', type],
    queryFn: async () => {
      const res = await dashboardService.getReports(type);
      return res.data.data;
    },
  });

  return (
    <SafeAreaView className={`flex-1 ${colors.bg}`}>
      <Header title="Reports" showBack />
      <View className="flex-row px-4 gap-2 mb-4">
        {(['daily', 'monthly'] as ReportType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setType(t)}
            className={`flex-1 py-2 rounded-xl items-center ${type === t ? 'bg-primary-600' : `border ${colors.border}`}`}
          >
            <Text className={type === t ? 'text-white font-semibold capitalize' : `${colors.textMuted} capitalize`}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView className="px-4">
        {isLoading ? (
          <Text className={colors.textMuted}>Loading...</Text>
        ) : (
          <>
            <Card className="mb-3">
              <Text className={`text-lg font-bold mb-3 ${colors.text}`}>Sales Report</Text>
              <ReportRow label="Revenue" value={formatCurrency(report?.sales?.revenue ?? 0)} />
              <ReportRow label="Profit" value={formatCurrency(report?.sales?.profit ?? 0)} />
              <ReportRow label="Net Profit" value={formatCurrency(report?.sales?.netProfit ?? 0)} />
              <ReportRow label="Transactions" value={String(report?.sales?.count ?? 0)} />
            </Card>

            <Card className="mb-3">
              <Text className={`text-lg font-bold mb-3 ${colors.text}`}>Expense Report</Text>
              <ReportRow label="Total Expenses" value={formatCurrency(report?.totalExpenses ?? 0)} />
              {report?.expenses?.map((e: { _id: string; total: number }) => (
                <ReportRow key={e._id} label={e._id} value={formatCurrency(e.total)} />
              ))}
            </Card>

            <Card className="mb-8">
              <Text className={`text-lg font-bold mb-3 ${colors.text}`}>Profit/Loss</Text>
              <Text
                className={`text-2xl font-bold ${
                  (report?.sales?.netProfit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(report?.sales?.netProfit ?? 0)}
              </Text>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const ReportRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-slate-100">
    <Text className="text-slate-500">{label}</Text>
    <Text className="font-semibold">{value}</Text>
  </View>
);
