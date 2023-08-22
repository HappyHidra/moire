import { ref } from 'vue'
import { useStore } from 'vuex'

export default function (productId) {
  const $store = useStore()
  const productAmount = ref(1)
  const productAdded = ref(false)
  const productAddSending = ref(false)
  const isShowAddedMessage = ref(false)

  const doAddToCart = () => {
    productAdded.value = false
    productAddSending.value = true

    $store
      .dispatch('addProductToCart', {
        productId: productId,
        amount: productAmount.value
      })
      .then(() => {
        productAdded.value = true
        productAddSending.value = false
        isShowAddedMessage.value = true
      })
  }

  return {
    doAddToCart,
    productAmount,
    productAdded,
    productAddSending,
    isShowAddedMessage
  }
}
