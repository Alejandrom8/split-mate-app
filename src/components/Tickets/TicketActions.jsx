import React, {useState, useEffect, useMemo} from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { fmtMoney } from '@/shared/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

/* Sub-componente para filas de totales alineadas tipo ticket */
function Row({ label, value, strong = false, primaryStyles = null, secondaryStyles = null }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'baseline',
      }}
    >
      {typeof label === 'string' && (
        <Typography
          variant="body2"
          sx={{
            ...primaryStyles,
          }}
          color={strong ? 'inherit' : 'text.secondary'}
        >
          {label}
        </Typography>
      )}
      {typeof label !== 'string' && label}
      <Typography
        variant="body2"
        sx={{
          textAlign: 'right',
          fontWeight: strong ? 800 : 600,
          ...secondaryStyles,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function TicketActions({ 
    editable, selectable,
    selectedItems, ticketTotal, itemsTotalSum,
    currency, loading, handleCancel, handlePublishTicket,
    handleAssignItems,
}) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [showSelectedItems, setShowSelectedItems] = useState(false);

  const toggleShowSelectedItems = () => setShowSelectedItems(!showSelectedItems);
  const totalSumIsCorrect = useMemo(() => Number(ticketTotal) === Number(itemsTotalSum), [ticketTotal, itemsTotalSum]);

  useEffect(() => {
    if (selectedItems.length === 0) {
      setShowSelectedItems(false);
    }
  }, [selectedItems]);

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        //bottom: 30,
        bottom: 0,
        borderRadius: 1,
        boxShadow: 3,
        backgroundColor: 'white',
        // borderTopWidth: 1,
        // borderStyle: 'solid',
        // borderColor: 'primary.main',
      }}
    >
      <CardContent>
        {editable && (
          <>
            <Row label="Suma de los items" value={fmtMoney(itemsTotalSum, currency)} />
            <Row
              label="TOTAL"
              value={fmtMoney(ticketTotal, currency)}
              strong
              primaryStyles={{
                fontWeight: 'bold',
              }}
              secondaryStyles={{
                color: totalSumIsCorrect ? 'primary.main' : 'error.main',
              }}
            />
            {!totalSumIsCorrect && (
              <Typography variant={'caption'} sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                <strong>WARN</strong>: Corrige los datos de los items para que cuadren con la suma
                final del ticket
              </Typography>
            )}
          </>
        )}
        {selectable && (
          <>
            <Row
              label={
                <Stack direction={'row'} spacing={1} alignItems={'center'}>
                  <Typography variant="body2">Items Seleccionados</Typography>
                  {selectedItems.length > 0 && (
                    <Tooltip title={'Mostrar Items'}>
                      <IconButton size={'small'} onClick={toggleShowSelectedItems}>
                        {showSelectedItems ? (
                          <KeyboardArrowUpIcon fontSize={'small'} />
                        ) : (
                          <KeyboardArrowDownIcon fontSize={'small'} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              }
              value={
                selectedItems.length
                  ? selectedItems.reduce((ac, it) => ac + Number(it.total_quantity), 0)
                  : 0
              }
            />
            <Collapse in={selectedItems?.length > 0 && showSelectedItems}>
              {selectedItems.map((sItem) => (
                <Row
                  key={sItem.id}
                  label={sItem.name}
                  value={Math.floor(Number(sItem.total_quantity))}
                  primaryStyles={{
                    color: '#777',
                  }}
                  secondaryStyles={{
                    color: '#777',
                  }}
                />
              ))}
              <Box sx={{ mb: 2 }} />
            </Collapse>
            <Row
              label="Total seleccionado"
              value={
                selectedItems.length
                  ? fmtMoney(
                      selectedItems.reduce(
                        (ac, it) => ac + Number(it.unit_price) * Number(it.total_quantity),
                        0
                      ),
                      currency
                    )
                  : 0
              }
              strong
              primaryStyles={{
                fontWeight: 'bold',
              }}
              secondaryStyles={{
                color: 'primary.main',
                fontSize: '1.1rem',
              }}
            />
          </>
        )}
      </CardContent>
      <CardActions sx={{ pb: 1.5, mt: 0 }}>
        {editable && (
          <>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={handleCancel}
            >
              Regresar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || !totalSumIsCorrect}
              onClick={handlePublishTicket}
              startIcon={loading && <CircularProgress size={'small'} />}
            >
              {loading ? 'Publicando...' : 'Publicar ticket'}
            </Button>
          </>
        )}
        {selectable && (
          <>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              onClick={handleAssignItems}
              startIcon={loading && <CircularProgress size={'small'} />}
            >
              {loading ? 'Guardando...' : 'Actualizar items'}
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
}
