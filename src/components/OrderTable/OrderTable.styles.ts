import { visuallyHidden } from '@mui/utils'

export default {
  tableContainer: {
    position: 'relative',
    '&.cardView': {
      backgroundColor: 'transparent',
      border: 'none',
      '.MuiTable-root': {
        width: 'auto',
        border: 'none',
      },
      '.MuiTableRow-root': {
        backgroundColor: '#fff',
      },
      '.MuiTableHead-root': visuallyHidden,
      '.MuiTableBody-root .MuiTableRow-root': {
        display: 'flex',
        flexWrap: 'wrap',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        '&:not(:last-child)': { marginBottom: '20px' },
      },
      '.MuiTableCell-root': {
        padding: '8px 10px',
        display: 'flex',
        width: '100%',
        borderBottom: '1px solid #e0e0e0',
        fontSize: '13px',
        '&[data-label]::before': {
          content: 'attr(data-label) ":"',
          whiteSpace: 'nowrap',
          fontWeight: 500,
          marginRight: '5px',
        },
      },
      '.cell-meta': {
        display: 'flex',
        alignItems: 'center',
        order: 1,
        width: '62%',
        paddingRight: 0,
      },
      '.order-id': {
        marginRight: '6px',
        fontSize: '15px',
        lineHeight: 'normal',
        letterSpacing: 'normal',
      },
      '.create-datetime': {
        display: 'flex',
        alignItems: 'center',
        marginTop: 0,
        span: {
          paddingLeft: '4px',
        },
        lineHeight: 'normal',
      },
      '.cell-priority': {
        order: 2,
        width: '38%',
        '.MuiChip-root': {
          marginLeft: 'auto',
        },
      },
      '.cell-deadline, .cell-cost': {
        flexDirection: 'column',
        width: 'auto',
        borderBottom: 'none',
        span: { paddingTop: '2px', fontWeight: 700, fontSize: '15px' },
      },
      '.cell-deadline': {
        order: 3,
      },
      '.cell-cost': {
        order: 4,
      },
      '.cell-brand': {
        order: 5,
      },
      '.cell-address': {
        order: 6,
      },
      '.cell-description': {
        order: 7,
      },
      '.cell-creator': {
        order: 8,
        borderBottom: 'none',
      },
      '.cell-executor': {
        order: 9,
        paddingTop: 0,
        borderBottom: 'none',
      },
      '.cell-actions, .cell-status': {
        width: 'auto',
        borderTop: '1px solid #e0e0e0',
        borderBottom: 'none',
      },
      '.cell-actions': {
        order: 10,
      },
      '.cell-status': {
        order: 11,
        flex: '1 1 auto',
        '.MuiButtonBase-root': { marginLeft: 'auto' },
      },
    },
  },
  table: {
    tableLayout: 'fixed',
    width: 1150,
    'th, td': {
      paddingTop: '14px',
      paddingBottom: '14px',
      lineHeight: 'normal',
    },
  },
}
