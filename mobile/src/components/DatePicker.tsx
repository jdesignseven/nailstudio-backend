import { useState } from 'react';
import { View, StyleSheet, Modal, Platform, Pressable, ScrollView } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
  date: Date;
  mode: 'date' | 'time';
  onDateChange: (date: Date) => void;
}

export function DatePicker({ date, mode, onDateChange }: DatePickerProps) {
  const [visible, setVisible] = useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['00', '15', '30', '45'];

  function handleDateSelect(year: number, month: number, day: number) {
    const newDate = new Date(date);
    newDate.setFullYear(year, month, day);
    onDateChange(newDate);
    setVisible(false);
  }

  function handleTimeSelect(h: number, m: string) {
    const newDate = new Date(date);
    newDate.setHours(h, parseInt(m));
    onDateChange(newDate);
    setVisible(false);
  }

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <>
      <Button
        mode="outlined"
        onPress={() => setVisible(true)}
        style={styles.button}
      >
        {mode === 'date'
          ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
          : format(date, 'HH:mm')}
      </Button>

      {visible && (
        <Modal transparent animationType="fade" onRequestClose={() => setVisible(false)}>
          <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
            <Surface style={styles.content} elevation={4}>
              <Text variant="titleMedium" style={styles.title}>
                {mode === 'date' ? 'Selecione a Data' : 'Selecione o Horário'}
              </Text>

              {mode === 'date' ? (
                <View style={styles.pickerGrid}>
                  <View style={styles.column}>
                    <Text variant="labelSmall" style={styles.label}>Dia</Text>
                    <ScrollView style={styles.scroll} nestedScrollEnabled>
                      {days.map((d) => (
                        <Button
                          key={d}
                          mode={date.getDate() === d ? 'contained' : 'text'}
                          compact
                          onPress={() => handleDateSelect(date.getFullYear(), date.getMonth(), d)}
                          style={styles.itemBtn}
                        >
                          {String(d).padStart(2, '0')}
                        </Button>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.column}>
                    <Text variant="labelSmall" style={styles.label}>Mês</Text>
                    <ScrollView style={styles.scroll} nestedScrollEnabled>
                      {months.map((m) => (
                        <Button
                          key={m}
                          mode={date.getMonth() === m ? 'contained' : 'text'}
                          compact
                          onPress={() => handleDateSelect(date.getFullYear(), m, date.getDate())}
                          style={styles.itemBtn}
                        >
                          {format(new Date(2000, m), 'MMM', { locale: ptBR })}
                        </Button>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.column}>
                    <Text variant="labelSmall" style={styles.label}>Ano</Text>
                    <ScrollView style={styles.scroll} nestedScrollEnabled>
                      {years.map((y) => (
                        <Button
                          key={y}
                          mode={date.getFullYear() === y ? 'contained' : 'text'}
                          compact
                          onPress={() => handleDateSelect(y, date.getMonth(), date.getDate())}
                          style={styles.itemBtn}
                        >
                          {String(y)}
                        </Button>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              ) : (
                <View style={styles.pickerGrid}>
                  <View style={styles.column}>
                    <Text variant="labelSmall" style={styles.label}>Hora</Text>
                    <ScrollView style={styles.scroll} nestedScrollEnabled>
                      {hours.map((h) => (
                        <Button
                          key={h}
                          mode={date.getHours() === h ? 'contained' : 'text'}
                          compact
                          onPress={() => handleTimeSelect(h, String(date.getMinutes()).padStart(2, '0'))}
                          style={styles.itemBtn}
                        >
                          {String(h).padStart(2, '0')}
                        </Button>
                      ))}
                    </ScrollView>
                  </View>
                  <View style={styles.column}>
                    <Text variant="labelSmall" style={styles.label}>Min</Text>
                    <ScrollView style={styles.scroll} nestedScrollEnabled>
                      {minutes.map((m) => (
                        <Button
                          key={m}
                          mode={String(date.getMinutes()).padStart(2, '0') === m ? 'contained' : 'text'}
                          compact
                          onPress={() => handleTimeSelect(date.getHours(), m)}
                          style={styles.itemBtn}
                        >
                          {m}
                        </Button>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              )}

              <Button mode="text" onPress={() => setVisible(false)} style={styles.closeBtn}>
                Fechar
              </Button>
            </Surface>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 8 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 24,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  title: { textAlign: 'center', color: '#D4899C', marginBottom: 16 },
  pickerGrid: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  column: { flex: 1, alignItems: 'center' },
  label: { color: '#999', marginBottom: 8, fontWeight: 'bold' },
  scroll: { maxHeight: 250 },
  itemBtn: { marginBottom: 2 },
  closeBtn: { marginTop: 16 },
});
