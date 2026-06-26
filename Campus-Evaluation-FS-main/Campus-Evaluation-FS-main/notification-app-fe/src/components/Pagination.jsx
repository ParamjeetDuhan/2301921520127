import { Box, Pagination } from "@mui/material";

export default function PaginationComponent({
  page,
  totalPages,
  setPage,
}) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={4}
    >
      <Pagination
        page={page}
        count={totalPages}
        color="primary"
        onChange={(e, value) => setPage(value)}
      />
    </Box>
  );
}