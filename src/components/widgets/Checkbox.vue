<template>
<div class="field" v-if="!isSimple">
  <label class="label" v-if="label.length > 0">
    {{ label }}
  </label>
  <p class="control">
    <span :class="{ select: true, 'is-top': this.isTop }">
      <input type="checkbox" :id="id" :value="value" @change="updateValue">
      <label for="id">{{ value }}</label>
    </span>
  </p>
</div>
</template>

<script>
export default {
  name: 'checkbox',

  props: {
    label: {
      default: '',
      type: String
    },
    id: {
      default: '',
      type: String
    },
    value: {
      default: '',
      type: String
    },
    isTop: {
      default: false,
      type: Boolean
    },
    isSimple: {
      default: false,
      type: Boolean
    }
  },

  computed: {
  },

  methods: {
    updateValue (event) {
      console.log(event.target.value)
    },
    onChange (event) {
      this.$emit('input', event.target.checked)
    },
    emitEnter () {
      this.$emit('enter', this.$refs.select.value)
    }
  }
}
</script>

<style scoped>
.is-top select {
  font-size: 1.2em;
  border: 0;
  border-bottom: 1px solid #CCC;
  border-radius: 0;
  height: 38px;
}

.is-top select:focus {
  border-color: #00B242;
  outline: 0;
}

.is-top:after {
  border: 2px solid #00B242;
  border-right: 0;
  border-top: 0;
}

.select-input {
  height: 31px;
}
</style>
