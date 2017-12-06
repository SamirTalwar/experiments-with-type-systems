package com.noodlesandwich.experiment

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows

class Tests {
    @Test
    @DisplayName("I can buy something from the shop")
    @Throws(ExperimentalException::class)
    fun iCanBuySomething() {
        val shop = Shop(
                Stock(
                        Item("orange", 19, Money.silver(7)),
                        Item("apple", 42, Money.silver(1)),
                        Item("magic missile spell", 2, Money.silver(92))))
        val wallet = Wallet(Money.silver(21))

        val basket = shop.basket()
        basket.pickUp("orange")
        basket.pickUp("apple")

        val items = basket.checkout(wallet)

        assertEquals(items, listOf("orange", "apple"))
        assertEquals(wallet, Wallet(Money.silver(13)))
        assertEquals(shop.stock, Stock(
                Item("orange", 18, Money.silver(7)),
                Item("apple", 41, Money.silver(1)),
                Item("magic missile spell", 2, Money.silver(92))))
    }

    @Test
    @DisplayName("throw me out if I don't have enough money in my wallet")
    @Throws(ExperimentalException::class)
    fun throwMeOut() {
        val shop = Shop(
                Stock(
                        Item("orange", 45, Money.silver(7)),
                        Item("apple", 6, Money.silver(1)),
                        Item("healing potion", 6, Money.silver(18))))
        val wallet = Wallet(Money.silver(13))

        val basket = shop.basket()
        basket.pickUp("healing potion")

        assertThrows(GetOutOfHere::class.java) {
            basket.checkout(wallet)
        }
    }

    @Test
    @DisplayName("don't let me pick up non-existent material")
    fun nonExistentMaterial() {
        val shop = Shop(
                Stock(
                        Item("orange", 23, Money.silver(7)),
                        Item("apple", 81, Money.silver(1)),
                        Item("raven", 2, Money.silver(51))))
        val basket = shop.basket()

        assertThrows(NonExistent::class.java) {
            basket.pickUp("bigfoot")
        }
    }
}
