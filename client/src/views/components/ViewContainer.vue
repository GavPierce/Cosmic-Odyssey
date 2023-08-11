<template>
  <!--  id="content" class="app-content" -->
  <div id="content">
    <view-container-top-bar v-if="!hideTopBar" />
    <logo></logo>
    <div class="container pb-3 col-xs-12 col-sm-10 col-md-10 col-lg-6">
      <slot></slot>
      <footer class="">
        <div class="row">
          <div class="col">
            <router-link
              :to="{ name: 'privacy-policy' }"
              class="me-2"
              title="Privacy Policy"
            >
              <i class="fas fa-file-alt"></i>
            </router-link>
          </div>
          <div class="col-auto">
            <a
              href="https://www.buymeacoffee.com/gavinpierce"
              target="_blank"
              class="text-warning"
              ><i class="fas fa-coffee me-1"></i>Donate</a
            >
          </div>
        </div>
      </footer>
    </div>
    <div class="mb-3 d-none d-md-block"></div>
  </div>
</template>

<script>
import LogoVue from "./Logo";
import ViewContainerTopBarVue from "./ViewContainerTopBar.vue";

export default {
  props: {
    hideTopBar: Boolean
  },
  components: {
    logo: LogoVue,
    "view-container-top-bar": ViewContainerTopBarVue
  }
};
</script>

<style scoped></style>
