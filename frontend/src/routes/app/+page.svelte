<div class="table-container">
  <table class="header-table">
    <thead>
      <tr>
        <th style="width: 200px;">Header 1</th>
        <th style="width: 150px;">Header 2</th>
        <th style="width: 250px;">Header 3</th>
      </tr>
    </thead>
  </table>
  <div class="scrollable-body">
    <table class="body-table">
      <tbody>
        <tr>
          <td style="width: 200px;">Data 1</td>
          <td style="width: 150px;">Data 2</td>
          <td style="width: 250px;">Data 3</td>
        </tr>
        <!-- More rows -->
      </tbody>
    </table>
  </div>
</div>
<style>
.table-container {
  width: 100%;
}

.header-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.body-table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

.scrollable-body {
  max-height: 200px; /* Set your height */
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll if not needed */
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
</style>