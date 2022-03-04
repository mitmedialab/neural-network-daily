<script lang="ts">
  let rows: number = 6;
  let columns: number = 6;

  const isEven = (value: number): boolean => value % 2 === 0;

  const getColor = (row: number, column: number) => {
    const rowEven: boolean = isEven(row);
    const colEven: boolean = isEven(column);
    if (rowEven && colEven) return "black";
    if (rowEven && !colEven) return "orange";
    if (!rowEven && colEven) return "green";
    if (!rowEven && !colEven) return "red";
  };

  const getGridSquareStyle = (row: number, column: number) => {
    return `background-color: ${getColor(row, column)};
    grid-row: ${row + 1};
    grid-column: ${column + 1};`;
  };

  const getNodeStyle = (row: string, column: string, color: string) => {
    return `background-color: ${color};
    grid-row: ${row};
    grid-column: ${column};
    border-radius: 50%;`;
  };
</script>

<style>
  .container {
    display: grid;
    width: 100vw;
    height: 100vh;
    vertical-align: top;
    padding: 0px;
    border: none;
  }

  .crossed {
    position: relative;
    background-color: transparent;
  }

  .crossed:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 1px;
    bottom: 1px;
    border-width: 100px;
    border-style: solid;
    border-color: black transparent;
  }

  .crossed:after {
    content: "";
    position: absolute;
    left: 1px;
    right: 1px;
    top: 0;
    bottom: 0;
    border-width: 0;
    border-style: solid;
    border-color: transparent transparent;
  }
</style>

<div class="container">
  {#each Array(rows) as _, row}
    {#each Array(columns) as _, column}
      <div style={getGridSquareStyle(row, column)} />
    {/each}
  {/each}
  <div style={getGridSquareStyle(1, 1)} class="crossed" />
</div>
