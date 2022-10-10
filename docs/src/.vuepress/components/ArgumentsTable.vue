<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Config</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <strong> Default </strong>
        </td>
        <td>Standard button</td>
        <td>
          <Config :data="{}" />
        </td>
      </tr>
      <tr>
        <td>
          <strong> Submit </strong>
        </td>
        <td>Fancy buttons for submissions</td>
        <td>
          <Config :data="{type: 'submit'}" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  import Config from './Config';
  import Preview from './Preview';

  export default {
    name: 'ArgumentsTable',
    components: {Preview, Config},
  };
</script>

<style scoped></style>
