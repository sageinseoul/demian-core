import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface WithholdingTaxFormProps {
  open: boolean;
  onClose: () => void;
  employeeData: {
    name: string;
    residentNumber: string;
    employmentType: string;
    salary: number;
    taxAmount: number;
  };
}

const FormTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: '#fff',
  tableLayout: 'fixed',
  '& th, & td': {
    border: '1px solid #000',
    padding: '4px',
    fontSize: '12px',
    height: '25px',
    verticalAlign: 'middle',
    textAlign: 'center',
    position: 'relative',
  },
  '& input': {
    width: '100%',
    height: '100%',
    border: 'none',
    padding: '2px',
    fontSize: '12px',
    textAlign: 'right',
    backgroundColor: 'transparent',
    '&:focus': {
      outline: 'none',
      backgroundColor: '#f0f0f0',
    },
  },
  '& .label-cell': {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  '& .number-column': {
    width: '40px',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  '& .amount-cell': {
    width: '120px',
  },
});

const FormHeader = styled(Box)({
  textAlign: 'center',
  marginBottom: '20px',
  '& h2': {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
});

const WithholdingTaxForm: React.FC<WithholdingTaxFormProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          bgcolor: '#fff',
          padding: '20px',
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ visibility: 'hidden' }}>
          <CloseIcon />
        </Box>
        <Box sx={{ textAlign: 'center', flex: 1, fontSize: '14px' }}>
          ■ 소득세법 시행규칙 [별지 제21호 서식] &lt;개정 2025. 3. 1.&gt;
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FormHeader>
          <h2>원천징수이행상황신고서</h2>
          <Box sx={{ fontSize: '12px' }}>( 단위: 원 )</Box>
        </FormHeader>

        <FormTable>
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '35%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '35%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="label-cell">① 신고구분</td>
              <td colSpan={2}>
                <input type="text" data-code="A01" data-field="신고구분" />
              </td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>② 귀속연월</span>
                  <input type="text" data-code="A02" data-field="귀속연월" style={{ width: '70%' }} />
                </div>
              </td>
            </tr>
            <tr>
              <td className="label-cell">법인명(상호)</td>
              <td>
                <input type="text" data-code="A03" data-field="법인명" />
              </td>
              <td className="label-cell">사업자등록번호</td>
              <td>
                <input type="text" data-code="A04" data-field="사업자등록번호" />
              </td>
            </tr>
          </tbody>
        </FormTable>

        <Box sx={{ height: '20px' }} />

        <FormTable>
          <colgroup>
            <col style={{ width: '8%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <tbody>
            <tr>
              <td className="label-cell" rowSpan={5}>
                ③<br/>원천<br/>징수<br/>내역<br/>및<br/>납부<br/>세액
              </td>
              <td className="label-cell">소득구분</td>
              <td className="label-cell">코드</td>
              <td className="label-cell">인원</td>
              <td className="label-cell">총지급액</td>
              <td className="label-cell">소득세</td>
              <td className="label-cell">농어촌특별세</td>
              <td className="label-cell">가산세</td>
            </tr>
            {[
              { code: '01', name: '근로소득', codePrefix: 'B' },
              { code: '02', name: '퇴직소득', codePrefix: 'C' },
              { code: '03', name: '사업소득', codePrefix: 'D' },
              { code: '04', name: '기타소득', codePrefix: 'E' },
            ].map((row) => (
              <tr key={row.code}>
                <td className="label-cell">{row.name}</td>
                <td>
                  <input 
                    type="text" 
                    data-code={`${row.codePrefix}01`} 
                    data-field="코드"
                    defaultValue={row.code}
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    data-code={`${row.codePrefix}02`} 
                    data-field="인원"
                  />
                </td>
                <td className="amount-cell">
                  <input 
                    type="text" 
                    data-code={`${row.codePrefix}03`} 
                    data-field="총지급액"
                  />
                </td>
                <td className="amount-cell">
                  <input 
                    type="text" 
                    data-code={`${row.codePrefix}04`} 
                    data-field="소득세"
                  />
                </td>
                <td className="amount-cell">
                  <input 
                    type="text" 
                    data-code={`${row.codePrefix}05`} 
                    data-field="농어촌특별세"
                  />
                </td>
                <td className="amount-cell">
                  <input 
                    type="text" 
                    data-code={`${row.codePrefix}06`} 
                    data-field="가산세"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </FormTable>

        <Box sx={{ height: '20px' }} />

        <FormTable>
          <tbody>
            <tr>
              <td className="label-cell" colSpan={2}>신고인</td>
              <td>
                <input type="text" data-code="F01" data-field="신고인" />
              </td>
              <td className="label-cell">전화번호</td>
              <td>
                <input type="text" data-code="F02" data-field="전화번호" />
              </td>
            </tr>
          </tbody>
        </FormTable>

        <Box sx={{ textAlign: 'center', marginTop: '30px', fontSize: '12px' }}>
          위의 내용을 신고하며, 위 내용을 충분히 검토하였고 신고인이 알고 있는 사실 그대로를 정확하게 적었음을 확인합니다.
          <Box sx={{ marginTop: '20px' }}>
            신고인 :
            <input
              type="text"
              data-code="G01"
              data-field="서명"
              style={{
                width: '200px',
                borderBottom: '1px solid #000',
                marginLeft: '10px',
                textAlign: 'center'
              }}
            />
            (서명 또는 인)
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WithholdingTaxForm; 