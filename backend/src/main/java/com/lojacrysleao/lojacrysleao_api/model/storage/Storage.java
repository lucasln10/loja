package com.lojacrysleao.lojacrysleao_api.model.storage;

import com.lojacrysleao.lojacrysleao_api.model.loja.Product;
import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "storage")
public class Storage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    private int quantity;

    private int reservation;

    @Column(name = "last_low_stock_alert_at")
    private LocalDateTime lastLowStockAlertAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getReservation() {
        return reservation;
    }

    public void setReservation(int reservation) {
        this.reservation = reservation;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public LocalDateTime getLastLowStockAlertAt() {
        return lastLowStockAlertAt;
    }

    public void setLastLowStockAlertAt(LocalDateTime lastLowStockAlertAt) {
        this.lastLowStockAlertAt = lastLowStockAlertAt;
    }

}
