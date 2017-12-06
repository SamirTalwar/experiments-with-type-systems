package com.noodlesandwich.experiment

class Shop(val stock: Stock) {
    fun basket(): Basket {
        return Basket(stock)
    }
}

data class Stock(private val items: List<Item>) {
    constructor(vararg items: Item) : this(items.toList())

    fun find(itemName: String): Item? {
        return items.find { item -> item.name == itemName }
    }
}

class Basket(private val stock: Stock) {
    private val items: MutableList<String> = mutableListOf()

    @Throws(NonExistent::class)
    fun pickUp(itemName: String) {
        if (stock.find(itemName) == null) {
            throw NonExistent(itemName)
        }
        this.items.add(itemName)
    }

    fun checkout(wallet: Wallet): List<String> {
        val price = items
                .map { itemName -> stock.find(itemName)!!.price }
                .reduce { a, b -> a + b }
        if (wallet.money < price) {
            throw GetOutOfHere()
        }

        wallet.money -= price
        items.forEach { itemName ->
            this.stock.find(itemName)!!.quantity -= 1
        }
        val boughtItems = items.toList()
        items.clear()
        return boughtItems
    }
}

data class Item(val name: String, var quantity: Int, val price: Money)

data class Wallet(var money: Money)

interface Money {
    operator fun plus(other: Money): Money

    operator fun minus(other: Money): Money

    operator fun compareTo(other: Money): Int

    data class Silver(private val quantity: Int) : Money {
        override fun plus(other: Money): Money {
            when (other) {
                is Silver ->
                    return Silver(quantity + other.quantity)
                else ->
                    throw UnsupportedOperationException("Cannot add $other to silver.")
            }
        }

        override fun minus(other: Money): Money {
            when (other) {
                is Silver ->
                    return Silver(quantity - other.quantity)
                else ->
                    throw UnsupportedOperationException("Cannot subtract $other from silver.")
            }
        }

        override fun compareTo(other: Money): Int {
            when (other) {
                is Silver ->
                    return quantity.compareTo(other.quantity)
                else ->
                    throw UnsupportedOperationException("Cannot compare $other to silver.")
            }
        }
    }

    companion object {
        fun silver(quantity: Int): Money {
            return Silver(quantity)
        }
    }
}

sealed class ExperimentalException : Exception()
class GetOutOfHere : ExperimentalException()
data class NonExistent(val itemName: String) : ExperimentalException()
