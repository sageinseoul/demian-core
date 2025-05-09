import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

interface WithholdingTaxReportProps {
  data: {
    businessNumber: string;
    businessName: string;
    representativeName: string;
    address: string;
    employees: Array<{
      name: string;
      residentNumber: string;
      employmentType: '정규직' | '비정규직';
      salary: number;
      taxAmount: number;
      nonTaxableAmount: number;
    }>;
  };
}

const WithholdingTaxReport: React.FC<WithholdingTaxReportProps> = ({ data }) => {
  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        하성원님의 원천세 신고서
      </Typography>
      <Typography variant="h5" align="center" gutterBottom>
        별지 제22호서식 [원천세 신고서]
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>사업자등록번호</TableCell>
              <TableCell>{data.businessNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>상호(법인명)</TableCell>
              <TableCell>{data.businessName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>대표자명</TableCell>
              <TableCell>{data.representativeName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>주소</TableCell>
              <TableCell>{data.address}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>성명</TableCell>
              <TableCell>주민등록번호</TableCell>
              <TableCell>근무형태</TableCell>
              <TableCell>급여액</TableCell>
              <TableCell>비과세금액</TableCell>
              <TableCell>과세대상금액</TableCell>
              <TableCell>세액</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.employees.map((employee, index) => (
              <TableRow key={index}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.residentNumber}</TableCell>
                <TableCell>{employee.employmentType}</TableCell>
                <TableCell>{employee.salary.toLocaleString()}</TableCell>
                <TableCell>{employee.nonTaxableAmount.toLocaleString()}</TableCell>
                <TableCell>{(employee.salary - employee.nonTaxableAmount).toLocaleString()}</TableCell>
                <TableCell>{employee.taxAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WithholdingTaxReport; 