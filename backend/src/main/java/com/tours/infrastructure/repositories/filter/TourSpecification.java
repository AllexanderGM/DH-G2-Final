package com.tours.infrastructure.repositories.filter;

import com.tours.infrastructure.entities.tour.Tour;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

public class TourSpecification {

    public static Specification<Tour> filterByCriteria(String query, String tags) {
        return (Root<Tour> root, CriteriaQuery<?> cq, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();

            if (query != null && !query.isEmpty()) {
                Predicate namePredicate = cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%");
                predicate = cb.and(predicate, namePredicate);
            }

            if (tags != null && !tags.isEmpty()) {
                Predicate categoriaPredicate = cb.equal(root.get("category"), tags);
                predicate = cb.and(predicate, categoriaPredicate);
            }

            return predicate;
        };
    }
}