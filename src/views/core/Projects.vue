<template>
  <div class="home">
    <v-simple-table v-if="projectList">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">name</th>
            <th class="text-left">your role</th>
            <th class="text-right">other members</th>
            <!-- <th class="text-right">
                        edit
                    </th> -->
          </tr>
        </thead>
        <tbody v-if="projectList.length">
          <tr v-for="p in projectList" :key="p.id">
            <td class="text-left">
              {{ p.name }}
            </td>
            <td class="text-left">
              {{ aLvl(p.access_level) }}
            </td>
            <td class="text-right">to be implemented...</td>
          </tr>
        </tbody>
        <span v-else> No active projects </span>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import settings from "@/settings";

export default {
  name: "Home",
  components: {},
  computed: {
    ...mapGetters(["projectList"]),
  },
  methods: {
    aLvl(lvl) {
      return settings.accessLevel(lvl);
    },
  },
  mounted() {
    this.$store.dispatch("fetchProjects");
  },
};
</script>
