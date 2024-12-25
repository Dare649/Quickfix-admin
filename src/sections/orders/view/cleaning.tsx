/* eslint-disable react/no-unstable-nested-components */
import type { RootState } from 'src/redux/store';

/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { useSelector } from 'react-redux';

// import { Download } from "@mui/icons-material";
import { Avatar, Chip } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import useOrderCategory from 'src/hooks/use-orders-category';

import { fNumber } from 'src/utils/format-number';

import CustomNoRowsOverlay from 'src/components/custom_no_row';

import ActionButton from './action';

export default function CleaningTable({ cleaningOrders }: any) {
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [loading, setLoading] = React.useState(false);
  const [filteredOrders, setFilteredOrders] = React.useState(cleaningOrders?.data ?? []);

  const { data: ordersData } = useOrderCategory(paginationModel.page + 1, 'cleaning');
  console.log('ORDERS HERE :::: ', cleaningOrders);

  const columns = [
    {
      field: 'user',
      headerName: 'Photo',
      width: 96,
      renderCell: (params: any) => (
        <Avatar src={params?.row?.user?.photo_url} variant="circular">
          {`${params?.row?.user?.first_name}`.substring(0, 1)}
          {`${params?.row?.user?.last_name}`.substring(0, 1)}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: 'Full Name',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.user?.first_name ?? ''} ${params?.row?.user?.last_name ?? ''}`}</p>
      ),
    },
    {
      field: 'email_address',
      headerName: 'Email Address',
      flex: 1,
      renderCell: (params: any) => (
        <p style={{ textTransform: 'none', fontSize: 14 }}>
          {params?.row?.user?.email_address ?? ''}
        </p>
      ),
    },
    {
      field: 'order_id',
      headerName: 'Order Num',
      width: 110,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.order_id ?? ''}`}</p>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`₦${fNumber(params?.row?.amount)}`}</p>
      ),
    },
    {
      field: 'items',
      headerName: 'Items',
      width: 70,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${fNumber(params?.row?.items?.length)}`}</p>
      ),
    },
    {
      field: 'pickup_date',
      headerName: 'Pickup On',
      width: 100,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${new Date(params.row?.pickup_date).toLocaleDateString('en-GB')}`}</p>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 108,
      renderCell: (params: any) => (
        <Chip
          label={params.row.status}
          sx={{
            color: params.row.status === 'active' ? 'green' : 'red',
            textTransform: 'capitalize',
          }}
        />
      ),
    },
    {
      field: 'tx_ref',
      headerName: 'Trans Ref',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${params?.row?.transaction?.trans_ref}`}</p>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created On',
      flex: 1,
      renderCell: (params: any) => (
        <p
          style={{ textTransform: 'capitalize', fontSize: 14 }}
        >{`${new Date(params.row?.createdAt).toLocaleDateString('en-GB')}`}</p>
      ),
    },
    {
      field: 'id',
      headerName: 'Action',
      width: 90,
      renderCell: (params: any) => <ActionButton row={params?.row} />,
    },
  ];

  React.useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      // const newData = await loadServerRows(paginationModel.page, data);
      if (ordersData) {
        console.log('SECOND PAGE DATA', ordersData);
        setFilteredOrders(ordersData?.data);
      }

      if (!active) {
        return;
      }

      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [paginationModel.page, ordersData]);

  return (
    <div style={{ height: '75vh', width: '100%' }}>
      {cleaningOrders && cleaningOrders?.data && filteredOrders && (
        <DataGrid
          sx={{ padding: 1 }}
          rows={filteredOrders}
          columns={columns}
          paginationMode="server"
          pageSizeOptions={[25]}
          rowCount={cleaningOrders?.totalItems}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: GridToolbar,
          }}
        />
      )}
    </div>
  );
}
