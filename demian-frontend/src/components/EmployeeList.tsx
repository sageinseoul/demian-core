import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as XLSX from 'xlsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WithholdingTaxForm from './WithholdingTaxForm';

interface NonTaxableItem {
  id: number;
  category: string;
  amount: number;
}

interface Employee {
  id: number;
  name: string;
  employmentType: '정규직' | '비정규직';
  position: string;
  residentNumber: string;
  salary: number;
  nonTaxableAmount: number;
  nonTaxableItems: NonTaxableItem[];
  taxAmount: number;
}

const initialEmployees: Employee[] = [
  { id: 1, name: '김철수', employmentType: '정규직', position: '개발자', residentNumber: '900101-1234567', salary: 3000000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 2, name: '이영희', employmentType: '정규직', position: '디자이너', residentNumber: '910202-2345678', salary: 3500000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 3, name: '박민수', employmentType: '비정규직', position: '인턴', residentNumber: '920303-3456789', salary: 2500000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 4, name: '최지원', employmentType: '정규직', position: '마케터', residentNumber: '930404-4567890', salary: 4000000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 5, name: '정다은', employmentType: '비정규직', position: '보조', residentNumber: '940505-5678901', salary: 2800000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 6, name: '강민준', employmentType: '정규직', position: '기획자', residentNumber: '950606-6789012', salary: 3200000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 7, name: '윤서연', employmentType: '비정규직', position: '보조', residentNumber: '960707-7890123', salary: 2700000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 8, name: '장지훈', employmentType: '정규직', position: '개발자', residentNumber: '970808-8901234', salary: 3800000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 9, name: '한수아', employmentType: '비정규직', position: '인턴', residentNumber: '980909-9012345', salary: 2600000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
  { id: 10, name: '신준호', employmentType: '정규직', position: '디자이너', residentNumber: '991010-0123456', salary: 4200000, nonTaxableAmount: 0, nonTaxableItems: [], taxAmount: 0 },
];

const StyledTableContainer = styled(TableContainer)({
  maxHeight: '400px',
  width: '100%',
  margin: '0',
});

const StyledTableCell = styled(TableCell)({
  padding: '8px',
  whiteSpace: 'nowrap',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    height: '40px',
  },
});

const StyledSelect = styled(Select)({
  height: '40px',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    minWidth: '300px',
  },
});

function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showTaxReport, setShowTaxReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingItem, setEditingItem] = useState<NonTaxableItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (id: number, field: keyof Employee, value: string | number) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    );
  };

  const handleSave = () => {
    // TODO: API 호출로 데이터 저장
    console.log('저장된 데이터:', employees);
    alert('저장되었습니다.');
  };

  const handleNonTaxableAmountClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleCloseDialog = () => {
    setSelectedEmployee(null);
    setOpenDialog(false);
  };

  const handleShowTaxReport = () => {
    setShowTaxReport(true);
  };

  const handleCloseTaxReport = () => {
    setShowTaxReport(false);
  };

  const parseExcelFile = (data: ArrayBuffer): Employee[] => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row: any, index) => ({
      id: index + 1,
      name: row['이름'] || '',
      employmentType: row['고용형태'] === '비정규직' ? '비정규직' : '정규직',
      position: row['직무'] || '',
      residentNumber: row['주민번호'] || '',
      salary: parseInt(row['세전급여']) || 0,
      nonTaxableAmount: parseInt(row['비과세금액']) || 0,
      nonTaxableItems: [],
      taxAmount: 0,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer;
        const parsedEmployees = parseExcelFile(data);
        
        // 데이터 유효성 검사
        const isValid = parsedEmployees.every(emp => 
          emp.name && 
          emp.residentNumber && 
          emp.salary > 0
        );

        if (!isValid) {
          throw new Error('엑셀 파일의 데이터 형식이 올바르지 않습니다.');
        }

        setEmployees(parsedEmployees);
        alert('엑셀 파일이 성공적으로 업로드되었습니다.');
      } catch (err) {
        setError(err instanceof Error ? err.message : '엑셀 파일 파싱 중 오류가 발생했습니다.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddNonTaxableItem = () => {
    if (!selectedEmployee || !newCategory || !newAmount) return;

    const newItem: NonTaxableItem = {
      id: Date.now(),
      category: newCategory,
      amount: parseInt(newAmount),
    };

    const updatedEmployee = {
      ...selectedEmployee,
      nonTaxableItems: [...selectedEmployee.nonTaxableItems, newItem],
      nonTaxableAmount: selectedEmployee.nonTaxableItems.reduce((sum, item) => sum + item.amount, 0) + parseInt(newAmount),
    };

    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      )
    );

    setSelectedEmployee(updatedEmployee);
    setNewCategory('');
    setNewAmount('');
  };

  const handleEditNonTaxableItem = (item: NonTaxableItem) => {
    setEditingItem(item);
    setNewCategory(item.category);
    setNewAmount(item.amount.toString());
  };

  const handleUpdateNonTaxableItem = () => {
    if (!selectedEmployee || !editingItem || !newCategory || !newAmount) return;

    const updatedItems = selectedEmployee.nonTaxableItems.map(item =>
      item.id === editingItem.id
        ? { ...item, category: newCategory, amount: parseInt(newAmount) }
        : item
    );

    const updatedEmployee = {
      ...selectedEmployee,
      nonTaxableItems: updatedItems,
      nonTaxableAmount: updatedItems.reduce((sum, item) => sum + item.amount, 0),
    };

    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      )
    );

    setSelectedEmployee(updatedEmployee);
    setEditingItem(null);
    setNewCategory('');
    setNewAmount('');
  };

  const handleDeleteNonTaxableItem = (itemId: number) => {
    if (!selectedEmployee) return;

    const updatedItems = selectedEmployee.nonTaxableItems.filter(item => item.id !== itemId);
    const updatedEmployee = {
      ...selectedEmployee,
      nonTaxableItems: updatedItems,
      nonTaxableAmount: updatedItems.reduce((sum, item) => sum + item.amount, 0),
    };

    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.id === selectedEmployee.id ? updatedEmployee : emp
      )
    );

    setSelectedEmployee(updatedEmployee);
  };

  const handleOpenDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl size="small">
          <StyledSelect
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <MenuItem key={year} value={year}>{year}년</MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <FormControl size="small">
          <StyledSelect
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MenuItem key={month} value={month}>{month}월</MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </Box>
      <StyledTableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>이름</StyledTableCell>
              <StyledTableCell>고용형태</StyledTableCell>
              <StyledTableCell>직무</StyledTableCell>
              <StyledTableCell>주민번호</StyledTableCell>
              <StyledTableCell>세전급여</StyledTableCell>
              <StyledTableCell>비과세금액</StyledTableCell>
              <StyledTableCell>과세대상금액</StyledTableCell>
              <StyledTableCell>세액</StyledTableCell>
              <StyledTableCell>원천세 신고서</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <StyledTableCell>
                  <StyledTextField
                    value={employee.name}
                    onChange={(e) => handleChange(employee.id, 'name', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <FormControl fullWidth size="small">
                    <StyledSelect
                      value={employee.employmentType}
                      onChange={(e) => handleChange(employee.id, 'employmentType', e.target.value as '정규직' | '비정규직')}
                    >
                      <MenuItem value="정규직">정규직</MenuItem>
                      <MenuItem value="비정규직">비정규직</MenuItem>
                    </StyledSelect>
                  </FormControl>
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={employee.position}
                    onChange={(e) => handleChange(employee.id, 'position', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    value={employee.residentNumber}
                    onChange={(e) => handleChange(employee.id, 'residentNumber', e.target.value)}
                    fullWidth
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    type="number"
                    value={employee.salary}
                    onChange={(e) => handleChange(employee.id, 'salary', parseInt(e.target.value) || 0)}
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: '원',
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleNonTaxableAmountClick(employee)}
                  >
                    {employee.nonTaxableAmount.toLocaleString()}원
                  </Button>
                </StyledTableCell>
                <StyledTableCell>
                  {(employee.salary - employee.nonTaxableAmount).toLocaleString()}원
                </StyledTableCell>
                <StyledTableCell>
                  {employee.taxAmount.toLocaleString()}원
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpenDialog(employee)}
                  >
                    보기
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <StyledDialog open={selectedEmployee !== null} onClose={handleCloseDialog}>
        <DialogTitle>비과세금액 상세</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="항목"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              size="small"
            />
            <TextField
              label="금액"
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              size="small"
              InputProps={{
                endAdornment: '원',
              }}
            />
            <Button
              variant="contained"
              onClick={editingItem ? handleUpdateNonTaxableItem : handleAddNonTaxableItem}
            >
              {editingItem ? '수정' : '추가'}
            </Button>
          </Box>
          <List>
            {selectedEmployee?.nonTaxableItems.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.category}
                  secondary={`${item.amount.toLocaleString()}원`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleEditNonTaxableItem(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteNonTaxableItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>닫기</Button>
        </DialogActions>
      </StyledDialog>

      <Dialog
        open={showTaxReport}
        onClose={handleCloseTaxReport}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleCloseTaxReport} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            원천세 신고서
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedYear}년 {selectedMonth}월 원천세 신고서
          </Typography>
          {/* TODO: 원천세 신고서 내용 구현 */}
        </DialogContent>
      </Dialog>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          엑셀 파일 업로드
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="excel-upload"
        />
        <label htmlFor="excel-upload">
          <Button variant="contained" component="span">
            엑셀 파일 선택
          </Button>
        </label>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          엑셀 파일은 다음 형식이어야 합니다: 이름, 고용형태(정규직/비정규직), 직무, 주민번호, 세전급여, 비과세금액
        </Typography>
      </Box>

      {selectedEmployee && (
        <WithholdingTaxForm
          open={openDialog}
          onClose={handleCloseDialog}
          employeeData={selectedEmployee}
        />
      )}
    </Box>
  );
}

export default EmployeeList; 